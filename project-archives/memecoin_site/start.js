import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy requests to the mining platform
app.use('/api/mining', createProxyMiddleware({ 
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

app.use('/subscription-mining', createProxyMiddleware({ 
  target: 'http://localhost:5000', 
  changeOrigin: true,
}));

// Always return the main index.html for client-side routing to work
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MemeMillionaire site running on port ${PORT}`);
});