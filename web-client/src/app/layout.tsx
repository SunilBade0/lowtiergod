import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "S.E.E.S. Network | Operations",
  description: "Tartarus Terminal - Direct WebRTC connection to the central host.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen flex flex-col overflow-x-hidden`}>
        <nav className="border-b-4 border-blue-600 bg-black/90 backdrop-blur-md sticky top-0 z-50 relative overflow-hidden">
          {/* Abstract angled background line for navbar */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 transform -skew-x-12 translate-x-20 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between h-20">
              <div className="flex-shrink-0 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center transform -skew-x-12 shadow-[3px_3px_0px_white]">
                  <svg className="w-6 h-6 text-white transform skew-x-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 6 18.5 6s1.5.67 1.5 1.5S19.33 9 18.5 9z"/>
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase">
                  S.E.E.S.<span className="text-blue-500">Net</span>
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center space-x-6 text-sm font-bold tracking-widest uppercase">
                  <div className="px-4 py-1 bg-white text-black transform -skew-x-12 shadow-[3px_3px_0px_#2563eb]">
                    <span className="transform skew-x-12 block">Library</span>
                  </div>
                  <div className="text-zinc-500 hover:text-white cursor-pointer transition-colors transform -skew-x-12">
                    <span className="transform skew-x-12 block">Settings</span>
                  </div>
                </div>
                
                {/* Replaced Log In button with Welcome / Player Name block */}
                <div className="flex items-center gap-3 pl-6 border-l-2 border-zinc-800 transform -skew-x-12">
                  <span className="text-blue-500 font-bold uppercase tracking-widest text-[10px] hidden sm:block">Operative:</span>
                  <div className="bg-zinc-800 text-white px-4 py-2 font-black uppercase tracking-wider text-sm shadow-[2px_2px_0px_#2563eb]">
                    <span className="transform skew-x-12 block">Makoto Y.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
