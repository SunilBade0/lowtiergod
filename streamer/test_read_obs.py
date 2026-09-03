import asyncio
from aiortc.contrib.media import MediaPlayer

async def main():
    player = MediaPlayer('/dev/video0', format='v4l2', options={'video_size': '1920x1080', 'framerate': '30'})
    video = player.video
    if not video:
        print("No video track found")
        return
    print("Reading frames...")
    for i in range(10):
        try:
            frame = await asyncio.wait_for(video.recv(), timeout=2.0)
            print(f"Received frame {i}: {frame}")
        except Exception as e:
            print(f"Error reading frame {i}: {e}")

asyncio.run(main())
