import asyncio
import websockets
import json

async def test():
    try:
        async with websockets.connect('ws://localhost:8080') as ws:
            print("Connected to User's Server!")
            # We won't send 'launch' so we don't spam their laptop with game instances,
            # we'll just send an empty offer to see if it responds.
            await ws.send(json.dumps({"type": "offer", "sdp": "v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtpmap:96 VP8/90000\r\n"}))
            print("Sent offer")
            reply = await ws.recv()
            print("Received reply length:", len(reply))
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
