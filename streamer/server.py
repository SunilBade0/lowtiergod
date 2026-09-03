import asyncio
import json
import logging
import subprocess
import time
import os
import fractions
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
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

def create_obs_autostream_json(window_string):
    obs_dir = os.path.expanduser("~/.config/obs-studio/basic/scenes")
    os.makedirs(obs_dir, exist_ok=True)
    json_path = os.path.join(obs_dir, "AutoStream.json")
    
    collection = {
        "current_scene": "Scene",
        "current_program_scene": "Scene",
        "name": "AutoStream",
        "scene_order": [{"name": "Scene"}],
        "sources": [
            {
                "name": "Scene",
                "id": "scene",
                "settings": {
                    "items": [
                        {
                            "name": "GameCapture",
                            "source_uuid": "11111111-1111-1111-1111-111111111111",
                            "visible": True,
                            "locked": False,
                            "id": 1
                        }
                    ]
                }
            },
            {
                "name": "GameCapture",
                "uuid": "11111111-1111-1111-1111-111111111111",
                "id": "xcomposite_input",
                "settings": {
                    "window": window_string
                }
            }
        ]
    }
    with open(json_path, 'w') as f:
        json.dump(collection, f, indent=4)
    logging.info(f"Created OBS AutoStream.json for window string: {repr(window_string)}")

class SwitchingTrack(VideoStreamTrack):
    def __init__(self, placeholder):
        super().__init__()
        self.placeholder = placeholder
        self.game = None
        self._start_time = None
        
    async def recv(self):
        track = self.game if self.game else self.placeholder
        frame = await track.recv()
        
        if self._start_time is None:
            self._start_time = time.time()
            
        frame.pts = int((time.time() - self._start_time) * 90000)
        frame.time_base = fractions.Fraction(1, 90000)
        return frame

async def monitor_game(track, game_id):
    logging.info(f"Monitoring for game window: steam_app_{game_id} or fullscreen")
    import os
    
    # 1. Loop every 2 seconds to check if the game is running
    while True:
        game_running = False
        try:
            out = subprocess.check_output(["wmctrl", "-l"]).decode()
            for line in out.splitlines():
                if f"steam_app_{game_id}" in line.lower() or "steam_app" in line.lower() or "p3r" in line.lower():
                    game_running = True
                    break
        except Exception:
            pass

        if not game_running:
            logging.info("Waiting for Persona 3 Reload to start...")
            await asyncio.sleep(2.0)
            continue
            
        logging.info("Game window detected! Launching OBS Studio...")
        
        # 2. Check if OBS is already running, if not, launch it
        obs_running = False
        try:
            subprocess.check_output(["pgrep", "obs"])
            obs_running = True
        except subprocess.CalledProcessError:
            pass

        if not obs_running:
            # Generate the OBS collection for this specific game
            create_obs_autostream_json(f"steam_app_{game_id}")
            
            subprocess.Popen(
                ["obs", "--collection", "AutoStream", "--startvirtualcam", "--minimize-to-tray"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            await asyncio.sleep(4.0) # Give OBS time to start the virtual camera
            
        # 3. Connect to the Virtual Camera
        obs_device = None
        for i in range(10):
            name_path = f"/sys/class/video4linux/video{i}/name"
            try:
                with open(name_path, 'r') as f:
                    if "OBS Virtual Camera" in f.read():
                        obs_device = f"/dev/video{i}"
                        break
            except FileNotFoundError:
                pass

        if obs_device:
            try:
                screen_player = MediaPlayer(obs_device, format='v4l2')
                track.game = screen_player.video
                logging.info(f"Successfully connected to OBS Virtual Camera at {obs_device}! Streaming to phone.")
                
                # Keep checking if game is still running while streaming
                while game_running:
                    await asyncio.sleep(2.0)
                    game_running = False
                    try:
                        out = subprocess.check_output(["wmctrl", "-l"]).decode()
                        for line in out.splitlines():
                            if f"steam_app_{game_id}" in line.lower() or "steam_app" in line.lower() or "p3r" in line.lower():
                                game_running = True
                                break
                    except Exception:
                        pass
                
                logging.info("Game closed. Stopping stream...")
                track.game = None
                
            except Exception as e:
                logging.info(f"Waiting for OBS Virtual Camera to initialize...")
                await asyncio.sleep(2.0)
        else:
            logging.info("Waiting for OBS Virtual Camera device to appear...")
            await asyncio.sleep(2.0)

async def handle_signaling(websocket):
    logging.info("Client connected for signaling")
    pc = RTCPeerConnection()
    
    # 1. Setup the loading screen video player
    placeholder_player = MediaPlayer('loading.mp4', loop=True)
    
    # Create the switching track
    video_track = SwitchingTrack(placeholder_player.video)
    pc.addTransceiver(video_track, direction="sendonly")
    
    @pc.on("datachannel")
    def on_datachannel(channel):
        logging.info(f"Data channel established: {channel.label}")
        @channel.on("message")
        def on_message(message):
            try:
                data = json.loads(message)
                event_type = data.get("type")
                key_str = data.get("key")
                
                k = special_keys.get(key_str, key_str)
                
                if event_type == "keydown":
                    keyboard.press(k)
                elif event_type == "keyup":
                    keyboard.release(k)
            except Exception as e:
                logging.error(f"Input error: {e}")

    monitor_task = None

    try:
        async for message in websocket:
            data = json.loads(message)
            if data["type"] == "offer":
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
                    # Start monitoring for the game window
                    monitor_task = asyncio.create_task(monitor_game(video_track, game_id))
                except Exception as e:
                    logging.error(f"Failed to launch steam: {e}")
    except websockets.exceptions.ConnectionClosed:
        logging.info("Client disconnected")
    finally:
        if monitor_task:
            monitor_task.cancel()
        await pc.close()

async def main():
    logging.info("Starting WebRTC Signaling Server on ws://0.0.0.0:3001")
    async with websockets.serve(handle_signaling, "0.0.0.0", 3001):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
