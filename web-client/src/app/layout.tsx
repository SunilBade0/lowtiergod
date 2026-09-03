import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CloudPlay | Game Anywhere",
  description: "Stream high-end PC games directly to your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-900 text-slate-50 min-h-screen flex flex-col`}>
        <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg shadow-lg shadow-green-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 6 18.5 6s1.5.67 1.5 1.5S19.33 9 18.5 9z"/>
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Cloud<span className="text-green-400">Play</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center space-x-1 text-sm font-medium text-slate-300">
                  <span className="px-3 py-2 rounded-md bg-slate-800 text-green-400">Library</span>
                  <span className="px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">Settings</span>
                </div>
                <button className="bg-green-500 hover:bg-green-400 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-500/20">
                  Log In
                </button>
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
