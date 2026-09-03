import asyncio
import websockets
import json

async def test():
    try:
        print("Connecting to ws://127.0.0.1:3000/ws...")
        async with websockets.connect("ws://127.0.0.1:3000/ws") as ws:
            print("Connected! Sending dummy launch command...")
            await ws.send(json.dumps({"type": "launch", "gameId": "000"}))
            print("Message sent successfully!")
            return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

asyncio.run(test())
