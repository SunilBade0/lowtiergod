/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const httpProxy = require('http-proxy');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Create a proxy to route WebSockets to the Python server (running on 3001)
const proxy = httpProxy.createProxyServer({
  target: 'ws://127.0.0.1:3001',
  ws: true,
  changeOrigin: true
});

proxy.on('error', (err, req, socket) => {
  console.error('Proxy Error:', err);
  socket.end();
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    console.log(`[HTTP GET] ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
    handle(req, res, parse(req.url, true));
  });

  // Catch WebSocket upgrade requests and route them to Python
  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/ws')) {
      console.log(`[WS UPGRADE] Proxying to Python on 3001!`);
      proxy.ws(req, socket, head);
    } else {
      // Pass other WebSockets (like Next.js HMR) back to Next.js!
      app.getUpgradeHandler()(req, socket, head);
    }
  });

  server.listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Web+WebSocket Server ready on http://0.0.0.0:3000');
  });
});
