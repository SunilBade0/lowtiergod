import asyncio
import websockets
import json

async def test():
    async with websockets.connect("ws://127.0.0.1:3001") as ws:
        await ws.send(json.dumps({"type": "launch", "gameId": "2161700"}))
        await asyncio.sleep(2)
        print("Sent launch")

asyncio.run(test())
