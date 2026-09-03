import asyncio
import websockets
import json
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaPlayer

async def handle(websocket):
    pc = RTCPeerConnection()
    try:
        player = MediaPlayer('/dev/video0') # Use /dev/video0 or any dummy
    except Exception:
        # Fallback to blackhole or something if no camera
        pass
        
    # Mocking what server.py does:
    class DummyVideo:
        kind = "video"
    
    try:
        pc.addTransceiver("video", direction="sendonly")
    except Exception as e:
        print("addTransceiver error:", e)

    async for message in websocket:
        data = json.loads(message)
        if data["type"] == "offer":
            print("Received offer")
            try:
                offer = RTCSessionDescription(sdp=data["sdp"], type=data["type"])
                await pc.setRemoteDescription(offer)
                answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                await websocket.send(json.dumps({"type": "answer", "sdp": pc.localDescription.sdp}))
                print("Sent answer")
            except Exception as e:
                import traceback
                traceback.print_exc()
                break

async def main():
    async with websockets.serve(handle, "127.0.0.1", 3002):
        await asyncio.Future()

asyncio.run(main())
