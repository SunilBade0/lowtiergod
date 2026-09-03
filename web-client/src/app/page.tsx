'use client';

import { games } from "@/data/games";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Persona 3 Reload Stylized CSS Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
        
        {/* Deep blue/black base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000a1f] via-[#001c4d] to-[#000511]"></div>

        {/* Diagonal striped pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #3b82f6 0, #3b82f6 2px, transparent 2px, transparent 16px)' }}
        ></div>

        {/* Giant Floating Typography */}
        <div className="absolute top-0 right-[-5%] transform rotate-12 opacity-[0.04] select-none font-black text-[25vw] leading-none text-blue-300 mix-blend-overlay">
          S.E.E.S.
        </div>
        <div className="absolute bottom-[5%] left-[-2%] transform -rotate-6 opacity-[0.03] select-none font-black text-[18vw] leading-none text-white">
          TARTARUS
        </div>

        {/* Sharp Angular Glass Shards / Light Beams */}
        <div className="absolute top-[-10%] left-[-10%] w-[120vw] h-[25vh] bg-blue-600/20 transform -rotate-12 blur-3xl mix-blend-screen"></div>
        
        {/* Crisp diagonal UI lines */}
        <div className="absolute top-[20%] right-[-10%] w-[120vw] h-[2px] bg-blue-500/30 transform -rotate-12 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        <div className="absolute top-[22%] right-[-10%] w-[120vw] h-[10px] bg-blue-600/10 transform -rotate-12 backdrop-blur-sm"></div>

        <div className="absolute bottom-[15%] left-[-10%] w-[80vw] h-[15vh] bg-cyan-500/5 transform skew-x-[45deg] backdrop-blur-md border-t border-b border-cyan-400/20"></div>

        {/* Vignette / Shadow border */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]"></div>
        
        {/* Floating particles/dots pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1.5px,transparent_1.5px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Removed Hero Section per user request */}

        {/* Database / Library Section */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-between mb-10 border-b-2 border-blue-600/30 pb-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
              <span className="bg-blue-600 w-12 h-12 flex items-center justify-center text-white -skew-x-12 shadow-[3px_3px_0px_white]">
                01
              </span>
              Target Database
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {games.map((game, index) => (
              <Link 
                href={`/play/${game.id}`} 
                key={game.id} 
                className="group relative block outline-none"
              >
                <div className="absolute inset-0 bg-blue-600 transform scale-95 opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:-rotate-2 group-hover:translate-x-2 group-hover:translate-y-2 z-0"></div>
                
                <div className="relative z-10 bg-zinc-900 border-2 border-zinc-800 transition-colors duration-300 group-hover:border-white overflow-hidden flex flex-col h-full">
                  
                  <div className="absolute top-0 right-0 w-12 h-12 bg-white transform translate-x-6 -translate-y-6 rotate-45 z-20 transition-transform group-hover:bg-blue-500"></div>

                  <div className="aspect-[16/9] w-full relative overflow-hidden bg-black p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={game.imageUrl} 
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <div className="text-white font-black text-3xl uppercase tracking-widest border-y-4 border-white py-2 transform -skew-x-12 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                        Launch
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col bg-zinc-900/90 backdrop-blur-sm relative z-10">
                    <div className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-2">Target No. {index + 1}</div>
                    <h3 className="text-2xl font-black mb-1 text-white uppercase tracking-tight">{game.title}</h3>
                    <p className="text-sm text-zinc-400 mb-6 font-bold">{game.developer}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {game.tags.map(tag => (
                        <span key={tag} className="text-xs uppercase font-bold tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 transform -skew-x-6">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
