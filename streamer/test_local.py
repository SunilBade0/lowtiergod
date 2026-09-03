import asyncio
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer
from server import SwitchingTrack

async def test():
    pc1 = RTCPeerConnection()
    pc2 = RTCPeerConnection()

    # pc1 sends video
    p = MediaPlayer('loading.mp4', loop=True)
    t = SwitchingTrack(p.video)
    pc1.addTransceiver(t, direction="sendonly")

    # pc2 receives video
    @pc2.on("track")
    def on_track(track):
        print("pc2 received track:", track.kind)
        asyncio.create_task(consume_track(track))

    async def consume_track(track):
        try:
            frame = await track.recv()
            print("SUCCESS! Got frame on pc2:", frame.width, "x", frame.height)
        except Exception as e:
            print("Error receiving frame on pc2:", e)

    offer = await pc1.createOffer()
    await pc1.setLocalDescription(offer)
    await pc2.setRemoteDescription(pc1.localDescription)

    answer = await pc2.createAnswer()
    await pc2.setLocalDescription(answer)
    await pc1.setRemoteDescription(pc2.localDescription)

    await asyncio.sleep(3)
    await pc1.close()
    await pc2.close()

asyncio.run(test())
