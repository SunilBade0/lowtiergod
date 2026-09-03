import asyncio
import json
import logging
import subprocess
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer
import websockets
from pynput.keyboard import Controller, Key

keyboard = Controller()

# A simple mapping for special browser keys to pynput keys
special_keys = {
    'Enter': Key.enter,
    'Backspace': Key.backspace,
    'Tab': Key.tab,
    'Shift': Key.shift,
    'Control': Key.ctrl,
    'Alt': Key.alt,
    'Escape': Key.esc,
    'ArrowUp': Key.up,
    'ArrowDown': Key.down,
    'ArrowLeft': Key.left,
    'ArrowRight': Key.right,
    ' ': Key.space
}

logging.basicConfig(level=logging.INFO)

async def handle_signaling(websocket):
    logging.info("Client connected for signaling")
    pc = RTCPeerConnection()
    
    # Auto-start OBS Studio if it's not already running
    try:
        if subprocess.run(["pgrep", "-x", "obs"], capture_output=True).returncode != 0:
            logging.info("OBS not running. Auto-starting OBS with Virtual Camera...")
            subprocess.Popen(["obs", "--startvirtualcam", "--minimize-to-tray"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        logging.error(f"Failed to check/start OBS: {e}")
        
    # Use v4l2 virtual camera to flawlessly capture the screen on Wayland (Hyprland)
    # The user can use OBS Studio "Virtual Camera" to pipe the screen here!
    player = None
    for attempt in range(20):
        try:
            player = MediaPlayer('/dev/video2', format='v4l2', options={'fflags': 'nobuffer', 'flags': 'low_delay'})
            break
        except Exception as e:
            logging.warning(f"Video device busy, retrying in 0.5s... ({e})")
            await asyncio.sleep(0.5)
    
    if not player:
        logging.error("Could not open /dev/video2. Is OBS Virtual Camera running?")
        return
        
    pc.addTrack(player.video)
    
    @pc.on("datachannel")
    def on_datachannel(channel):
        logging.info(f"Data channel established: {channel.label}")
        @channel.on("message")
        def on_message(message):
            try:
                data = json.loads(message)
                event_type = data.get("type")
                key_str = data.get("key")
                
                # Map browser key string to pynput Key object if it's special
                k = special_keys.get(key_str, key_str)
                
                if event_type == "keydown":
                    logging.info(f"KeyDown: {key_str}")
                    keyboard.press(k)
                elif event_type == "keyup":
                    logging.info(f"KeyUp: {key_str}")
                    keyboard.release(k)
            except Exception as e:
                logging.error(f"Input error: {e}")

    try:
        async for message in websocket:
            data = json.loads(message)
            if data["type"] == "offer":
                # Fix for aiortc crash: strip problematic extmap lines from modern browsers
                clean_sdp = "\r\n".join([line for line in data["sdp"].splitlines() if not line.startswith("a=extmap")])
                offer = RTCSessionDescription(sdp=clean_sdp, type=data["type"])
                await pc.setRemoteDescription(offer)
                answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                await websocket.send(json.dumps({
                    "type": pc.localDescription.type,
                    "sdp": pc.localDescription.sdp
                }))
            elif data["type"] == "launch":
                game_id = data.get("gameId")
                logging.info(f"Launching Steam game: {game_id}")
                try:
                    subprocess.Popen(["steam", "-applaunch", str(game_id)])
                except Exception as e:
                    logging.error(f"Failed to launch steam: {e}")
    except websockets.exceptions.ConnectionClosed:
        logging.info("Client disconnected")
    finally:
        await pc.close()
        if player:
            player.video.stop()

async def main():
    logging.info("Starting WebRTC Signaling Server on ws://0.0.0.0:3001")
    async with websockets.serve(handle_signaling, "0.0.0.0", 3001):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
