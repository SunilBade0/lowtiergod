import asyncio
import websockets
import json

async def test():
    try:
        async with websockets.connect('ws://localhost:8080') as ws:
            print("Connected to WS!")
            # Send dummy offer just to trigger the aiortc parsing
            await ws.send(json.dumps({"type": "offer", "sdp": "v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"}))
            print("Sent offer, waiting for reply...")
    except Exception as e:
        print(f"Client Error: {e}")

asyncio.run(test())
