import asyncio
from aiortc.contrib.media import MediaPlayer
from PIL import Image

async def capture():
    try:
        player = MediaPlayer('/dev/video2', format='v4l2')
        frame = await asyncio.wait_for(player.video.recv(), timeout=5.0)
        img = frame.to_image()
        img.save("v4l2_capture.jpg")
        print("Captured successfully")
    except Exception as e:
        print("Capture failed:", repr(e))

asyncio.run(capture())
