'use client';

import React, { useRef } from 'react';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

interface VirtualGamepadProps {
  onKeyAction: (action: 'keydown' | 'keyup', key: string) => void;
}

const ActionButton = ({ 
  label, 
  buttonKey, 
  className, 
  onKeyAction 
}: { 
  label: string, 
  buttonKey: string, 
  className?: string,
  onKeyAction: (action: 'keydown' | 'keyup', key: string) => void
}) => {
  return (
    <button
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full font-bold text-sm shadow-lg active:scale-90 transition-transform flex items-center justify-center select-none ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onKeyAction('keydown', buttonKey);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onKeyAction('keyup', buttonKey);
      }}
      onPointerLeave={(e) => {
        e.preventDefault();
        onKeyAction('keyup', buttonKey);
      }}
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  );
};

export default function VirtualGamepad({ onKeyAction }: VirtualGamepadProps) {
  const activeLeftKeys = useRef<Set<string>>(new Set());
  const activeRightKeys = useRef<Set<string>>(new Set());

  const handleJoystickMove = (
    e: IJoystickUpdateEvent, 
    activeKeysRef: React.MutableRefObject<Set<string>>,
    keyMapping: { up: string, down: string, left: string, right: string }
  ) => {
    const threshold = 20;
    const x = e.x || 0;
    const y = e.y || 0;

    const newKeys = new Set<string>();
    
    if (y > threshold) newKeys.add(keyMapping.up);
    if (y < -threshold) newKeys.add(keyMapping.down);
    if (x > threshold) newKeys.add(keyMapping.right);
    if (x < -threshold) newKeys.add(keyMapping.left);

    activeKeysRef.current.forEach(key => {
      if (!newKeys.has(key)) {
        onKeyAction('keyup', key);
        activeKeysRef.current.delete(key);
      }
    });

    newKeys.forEach(key => {
      if (!activeKeysRef.current.has(key)) {
        onKeyAction('keydown', key);
        activeKeysRef.current.add(key);
      }
    });
  };

  const handleJoystickStop = (activeKeysRef: React.MutableRefObject<Set<string>>) => {
    activeKeysRef.current.forEach(key => {
      onKeyAction('keyup', key);
    });
    activeKeysRef.current.clear();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end pb-8 px-4 sm:pb-12 sm:px-12">
      {/* Left side: Movement Joystick & Utility */}
      <div className="flex flex-col items-center gap-6">
        <ActionButton 
          label="DASH" 
          buttonKey="Shift" 
          className="bg-slate-700/80 hover:bg-slate-600 text-white border border-slate-500 !w-20 !h-12 !rounded-lg pointer-events-auto"
          onKeyAction={onKeyAction}
        />
        <div className="pointer-events-auto bg-slate-900/40 rounded-full p-2 backdrop-blur-sm border border-slate-700/50">
          <Joystick 
            size={110} 
            sticky={false} 
            baseColor="rgba(255, 255, 255, 0.1)" 
            stickColor="rgba(255, 255, 255, 0.5)" 
            move={(e) => handleJoystickMove(e, activeLeftKeys, { up: 'w', down: 's', left: 'a', right: 'd' })} 
            stop={() => handleJoystickStop(activeLeftKeys)} 
          />
        </div>
      </div>

      {/* Right side: Camera Joystick & Action Buttons */}
      <div className="flex flex-col items-end gap-2">
        {/* Diamond layout for Action Buttons */}
        <div className="pointer-events-auto relative w-40 h-40 sm:w-48 sm:h-48 mr-2 sm:mr-4">
          <ActionButton 
            label="Y (Rush)" 
            buttonKey=" " 
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-500/80 hover:bg-yellow-400 text-yellow-950 border border-yellow-300"
            onKeyAction={onKeyAction}
          />
          <ActionButton 
            label="X (Menu)" 
            buttonKey="Tab" 
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-blue-500/80 hover:bg-blue-400 text-white border border-blue-300"
            onKeyAction={onKeyAction}
          />
          <ActionButton 
            label="B (Back)" 
            buttonKey="Escape" 
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-red-500/80 hover:bg-red-400 text-white border border-red-300"
            onKeyAction={onKeyAction}
          />
          <ActionButton 
            label="A (OK)" 
            buttonKey="Enter" 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-green-500/80 hover:bg-green-400 text-white border border-green-300"
            onKeyAction={onKeyAction}
          />
        </div>

        {/* Camera Joystick */}
        <div className="pointer-events-auto bg-slate-900/40 rounded-full p-2 backdrop-blur-sm border border-slate-700/50 mb-2 mr-2 sm:mb-4 sm:mr-4 self-center">
          <Joystick 
            size={90} 
            sticky={false} 
            baseColor="rgba(255, 255, 255, 0.1)" 
            stickColor="rgba(255, 255, 255, 0.4)" 
            move={(e) => handleJoystickMove(e, activeRightKeys, { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' })} 
            stop={() => handleJoystickStop(activeRightKeys)} 
          />
        </div>
      </div>
    </div>
  );
}
