import asyncio
from aiortc.contrib.media import MediaPlayer

async def test():
    try:
        player = MediaPlayer('/dev/video2', format='v4l2')
        frame = await asyncio.wait_for(player.video.recv(), timeout=2.0)
        print("Success, frame:", frame)
    except Exception as e:
        print("Error:", repr(e))

asyncio.run(test())
