import asyncio
from aiortc.contrib.media import MediaPlayer
from server import SwitchingTrack

async def test():
    try:
        p = MediaPlayer('loading.mp4', loop=True)
        t = SwitchingTrack(p.video)
        f = await t.recv()
        print("Success:", f)
    except Exception as e:
        print("Error:", e)

asyncio.run(test())
