import asyncio
import websockets
import json

async def test():
    try:
        async with websockets.connect('ws://localhost:8080') as ws:
            print("Connected! Sending launch for Cyberpunk 2077...")
            await ws.send(json.dumps({"type": "launch", "gameId": "1091500"}))
            print("Sent!")
            await asyncio.sleep(2)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
