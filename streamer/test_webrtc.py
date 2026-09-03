import asyncio
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer

async def test():
    pc = RTCPeerConnection()
    p = MediaPlayer('loading.mp4', loop=True)
    pc.addTransceiver(p.video, direction="sendonly")
    offer_sdp = """v=0
o=- 4611731400430051336 2 IN IP4 127.0.0.1
s=-
t=0 0
a=msid-semantic: WMS
m=video 9 UDP/TLS/RTP/SAVPF 96
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:testufrag1
a=ice-pwd:testpwd12345678901234567890
a=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00
a=setup:actpass
a=mid:0
a=recvonly
a=rtcp-mux
a=rtmap:96 VP8/90000
"""
    offer = RTCSessionDescription(sdp=offer_sdp, type="offer")
    await pc.setRemoteDescription(offer)
    print("Answer generated!")

asyncio.run(test())
