import asyncio
import json
import logging
import websockets
from aiortc import RTCPeerConnection, RTCSessionDescription

async def run():
    pc = RTCPeerConnection()
    pc.addTransceiver("video", direction="recvonly")
    
    @pc.on("track")
    def on_track(track):
        print(f"Received track: {track.kind}")

    try:
        async with websockets.connect("ws://127.0.0.1:8080") as ws:
            print("Connected WebSocket!")
            await ws.send(json.dumps({"type": "launch", "gameId": "1091500"}))
            
            offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            
            await ws.send(json.dumps({
                "type": pc.localDescription.type,
                "sdp": pc.localDescription.sdp
            }))
            
            reply = await ws.recv()
            data = json.loads(reply)
            
            if data["type"] == "answer":
                print("Received Answer!")
                await pc.setRemoteDescription(RTCSessionDescription(sdp=data["sdp"], type=data["type"]))
                print("WebRTC Connection Established!")
                await asyncio.sleep(5)
            else:
                print("Received something else:", data)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await pc.close()

asyncio.run(run())
