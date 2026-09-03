import asyncio
from aiortc.contrib.media import MediaPlayer

async def main():
    try:
        player = MediaPlayer(':0', format='x11grab', options={'video_size': '1920x1080', 'framerate': '30'})
        frame = await player.video.recv()
        print(f"Got frame: {frame.width}x{frame.height}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
