const { spawn } = require('child_process');
const path = require('path');

console.log("=================================================");
console.log("🚀 Starting CloudPlay Servers");
console.log("=================================================\n");

// 1. Start Python WebRTC Server
console.log("[1/2] Starting Python WebRTC Server (Port 3001)...");
const pythonProcess = spawn('bash', ['-c', 'source venv/bin/activate && python server.py'], {
  cwd: path.join(__dirname, 'streamer'),
  stdio: 'inherit'
});

// 2. Start Next.js Frontend Server
console.log("[2/2] Starting Next.js UI Server (Port 3000)...");
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'web-client'),
  stdio: 'inherit'
});

console.log("\n=================================================");
console.log("✅ Everything is running!");
console.log("📱 Open your phone's browser and go to:");
console.log("    http://192.168.29.176:3000");
console.log("=================================================\n");

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log("\nShutting down servers...");
  pythonProcess.kill();
  nextProcess.kill();
  process.exit();
});
