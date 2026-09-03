from aiortc.contrib.media import MediaPlayer
player = MediaPlayer('/dev/video2', format='v4l2')
print("Opened player")
player.video.stop()
