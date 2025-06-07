import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupWebsiteRoutes } from "./website";
import { setupWebSocketServer } from "./websocket";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup express-session
app.use(session({
  secret: "bitcoin-miner-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // HTTP only in development
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for persistent login
    sameSite: 'lax', // Changed to lax for better compatibility
    httpOnly: true // Prevent client-side JavaScript from accessing cookies
  },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Import the puzzle address monitor and withdrawal processor
  const puzzleMonitor = await import('./lib/puzzleAddressMonitor');
  const withdrawalProcessor = await import('./lib/pendingWithdrawalProcessor');
  
  // Set up website routes first - before API routes
  setupWebsiteRoutes(app);
  
  // Start the puzzle address monitor
  try {
    console.log('Starting puzzle address monitor...');
    puzzleMonitor.startPuzzleAddressMonitor();
  } catch (error) {
    console.error('Failed to start puzzle address monitor:', error);
  }
  
  // Start the withdrawal processor to handle pending transactions
  try {
    console.log('Starting withdrawal processor...');
    // The withdrawal processor self-initializes, so we don't need to call any methods
  } catch (error) {
    console.error('Failed to start withdrawal processor:', error);
  }
  
  // Register development admin access route
  try {
    const adminAccessRouter = require('./admin-access');
    app.use('/dev-api', adminAccessRouter);
    console.log('Development admin access routes registered');
  } catch (error) {
    console.error('Error registering admin access routes:', error);
  }
  
  // Now register API routes
  const server = await registerRoutes(app);
  
  // Set up WebSocket server for chat and broadcasting
  setupWebSocketServer(server);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
