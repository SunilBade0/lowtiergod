import { games } from "@/data/games";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="relative p-8 md:p-12 lg:px-16 lg:py-20 flex flex-col items-start">
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold tracking-wider mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            HACKATHON DEMO READY
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 max-w-2xl leading-tight">
            Play high-end games <br className="hidden md:block"/>on <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">any device.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-xl mb-8 font-medium">
            This client connects directly to the streaming server running on the Linux host. Select a game below to launch a low-latency WebRTC session.
          </p>
          <button className="bg-green-500 hover:bg-green-400 text-slate-900 px-8 py-4 rounded-xl text-lg font-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:-translate-y-1">
            Start Quick Play
          </button>
        </div>
      </div>

      {/* Library Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="bg-green-500 w-2 h-6 rounded-full mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            Your Library
          </h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link href={`/play/${game.id}`} key={game.id} className="group relative block overflow-hidden rounded-xl bg-slate-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] border border-slate-700/50 hover:border-green-500/50 flex flex-col">
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col bg-slate-800/90 backdrop-blur-sm relative z-10 border-t border-slate-700/50">
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-green-400 transition-colors">{game.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{game.developer}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {game.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-900 rounded text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
