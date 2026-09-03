'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import VirtualGamepad from './VirtualGamepad';

export default function CloudPlayer({ gameId }: { gameId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const [status, setStatus] = useState('Connecting...');
  const router = useRouter();

  const handleKeyAction = (action: 'keydown' | 'keyup', key: string) => {
    if (dcRef.current && dcRef.current.readyState === 'open') {
      dcRef.current.send(JSON.stringify({ type: action, key }));
    }
  };

  useEffect(() => {
    let pc: RTCPeerConnection;
    let ws: WebSocket;

    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyAction('keydown', e.key);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      handleKeyAction('keyup', e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const startSession = async () => {
      try {
        // Use Google's public STUN server so mobile devices can generate ICE candidates properly
        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Handle incoming video stream
        pc.ontrack = (event) => {
          if (event.track.kind === 'video' && videoRef.current) {
            if (event.streams && event.streams.length > 0) {
              videoRef.current.srcObject = event.streams[0];
            } else {
              videoRef.current.srcObject = new MediaStream([event.track]);
            }
            videoRef.current.play().catch(e => console.error("Play failed:", e));
            setStatus('Connected (Streaming)');
          }
        };

        // Create DataChannel for inputs
        dcRef.current = pc.createDataChannel('input_channel');
        dcRef.current.onopen = () => console.log('Data channel opened');
        
        // Connect to signaling server (our Python Streamer)
        // We now route the WebSocket through the Next.js proxy on the exact same port!
        const wsUrl = `ws://${window.location.host}/ws`;
        ws = new WebSocket(wsUrl);

        ws.onopen = async () => {
          setStatus('Negotiating...');
          
          // Pillar 4: Tell the Python server to launch the Steam game!
          ws.send(JSON.stringify({
            type: 'launch',
            gameId: gameId
          }));
          
          // Explicitly tell the server we want to receive video!
          // Without this, the offer is empty and the python server crashes!
          pc.addTransceiver('video', { direction: 'recvonly' });
          
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({
            type: pc.localDescription?.type,
            sdp: pc.localDescription?.sdp
          }));
        };

        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(data));
          }
        };
        
        ws.onerror = () => setStatus('Connection failed. Is the Python streamer running?');
        ws.onclose = () => {
          setStatus((prev) => prev.includes('Connection failed') ? prev : 'Disconnected');
        };
      } catch (err: unknown) {
        if (err instanceof Error) {
          setStatus(`Browser Error: ${err.message}`);
        } else {
          setStatus('Browser Error: Unknown error');
        }
      }
    };

    startSession();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (pc) pc.close();
      if (ws) ws.close();
    };
  }, [gameId]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <button 
          onClick={() => router.push('/')}
          className="bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-lg backdrop-blur text-sm font-bold transition border border-slate-700"
        >
          &larr; Exit Game
        </button>
        <div className="bg-slate-900/80 text-green-400 px-4 py-2 rounded-lg backdrop-blur text-sm font-mono flex items-center gap-2 border border-slate-700">
          <div className={`w-2 h-2 rounded-full ${status.includes('Streaming') ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          {status}
        </div>
      </div>
      
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-contain bg-black"
      />
      
      <VirtualGamepad onKeyAction={handleKeyAction} />
    </div>
  );
}
