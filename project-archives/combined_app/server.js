const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// Session middleware for auth with secure memory store
app.use(session({
  secret: 'kloudbugs-mining-secret-2025',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin credentials (only the admin has access currently)
// These would be replaced with actual credentials in production
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'mining123';

// Serve static files from the MPT-website folder
app.use(express.static(path.join(__dirname, '../MPT-website')));

// Login endpoint for the mining portal
app.post('/mining-login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if credentials match the admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set authenticated session
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ success: true, redirect: '/subscription-mining' });
  }
  
  // Invalid credentials
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Authentication middleware for mining routes
const authMiddleware = (req, res, next) => {
  // Check query parameters for direct access (useful for development)
  if (req.query.username === ADMIN_USERNAME && req.query.password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    req.session.username = ADMIN_USERNAME;
    return next();
  }
  
  // Check if authenticated in session
  if (req.session.authenticated) {
    return next();
  }
  
  // Not authenticated - redirect to login page
  return res.redirect('/login.html');
};

// Login page route
app.get('/mining-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../MPT-website/login.html'));
});

// Proxy API requests to the mining platform
app.use('/api', createProxyMiddleware({ 
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

// Protected mining portal access
app.use('/subscription-mining', authMiddleware, createProxyMiddleware({ 
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/subscription-mining': '/' // rewrite path to root for mining app
  }
}));

// For the MPT website specific routes
app.get(['/about', '/tokenomics', '/mining', '/roadmap', '/whitepaper'], (req, res) => {
  res.sendFile(path.join(__dirname, '../MPT-website/index.html'));
});

// For logout
app.get('/mining-logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Default website route goes to website index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../MPT-website/index.html'));
});

// Fallback route to the mining portal for unmatched routes
app.use('*', createProxyMiddleware({ 
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`
==========================================================
🚀 INTEGRATED APPLICATION RUNNING
==========================================================
📱 Website URL: http://localhost:${PORT}/
🔒 Mining Login: http://localhost:${PORT}/mining-login
💰 Mining Portal (after login): http://localhost:${PORT}/subscription-mining
==========================================================
  `);
});