import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { log } from './vite';

export function setupWebsiteRoutes(app: express.Express) {
  // Secure route for wallet operations - not available in PUBLIC-DEPLOYMENT
  app.get('/real-withdrawal.html', (req, res) => {
    res.status(403).send('Wallet operations are only available in the ADMIN-GUARDIAN environment for security reasons.');
  });
  
  // Secure route for transaction demo - not available in PUBLIC-DEPLOYMENT
  app.get('/real-transaction-demo.html', (req, res) => {
    res.status(403).send('Transaction operations are only available in the ADMIN-GUARDIAN environment for security reasons.');
  });

  // Create a middleware to check if the user is trying to access the mining portal
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Log route for debugging
    console.log(`Route requested: ${req.method} ${req.path}`);
    
    // Check if already logged in and trying to access a website path
    const isLoggedIn = req.session?.userId;
    const isApiRequest = req.path.startsWith('/api/');
    const isAssetRequest = req.path.includes('.') || req.path.startsWith('/@');
    
    // Special cases for static HTML pages have been handled above
    if (req.path === '/real-withdrawal.html' || req.path === '/real-transaction-demo.html') {
      return next();
    }
    
    if (isApiRequest || isAssetRequest) {
      // Let API requests and asset requests pass through
      return next();
    }
    
    // Handle login routes specifically
    if (req.path === '/login' || req.path === '/auth/login' || req.path === '/register') {
      if (isLoggedIn) {
        // User is already logged in, redirect to dashboard
        log(`Already logged in user accessing ${req.path}, redirecting to dashboard`);
        return res.redirect('/dashboard');
      } else {
        // User is not logged in, let the React route handle login
        log(`Login/register route requested: ${req.path}`);
        return next();
      }
    }
    
    // Website public routes - accessible without login
    const publicWebsiteRoutes = [
      '/', 
      '/mining', 
      '/token', 
      '/tera-info',
      '/about',
      '/dashboard',
      '/mining-portal',
      '/register'
    ];
    
    const isPublicWebsiteRoute = publicWebsiteRoutes.includes(req.path) || 
                                req.path.startsWith('/assets/');
    
    // Protected routes that require authentication
    const protectedRoutes = [
      '/dashboard',
      '/mining-portal',
      '/settings',
      '/wallet',
      '/history',
      '/admin',
      '/special-wallet'
    ];
    
    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => req.path.startsWith(route));
    
    // If trying to access protected route without being logged in
    if (isProtectedRoute && !isLoggedIn) {
      log(`Unauthenticated access to protected route: ${req.path}, redirecting to login`);
      return res.redirect('/login');
    }
    
    // If this is a mining portal request (already logged in) but trying to access 
    // a public website route like the home page, serve the website
    if (isLoggedIn && isPublicWebsiteRoute && !req.path.startsWith('/dashboard') && !req.path.startsWith('/mining-portal')) {
      log(`Website route requested while logged in: ${req.path}`);
      // Let the route continue to be handled by React router
      return next();
    }
    
    // If this is a mining portal request, let it go to the mining dashboard
    if (isLoggedIn && (req.path.startsWith('/dashboard') || req.path.startsWith('/mining-portal'))) {
      log(`Mining portal route requested: ${req.path}`);
      // Let the route be handled by the existing dashboard logic
      return next();
    }
    
    // This is a website request without login, send to the React app
    log(`Public website route requested: ${req.path}`);
    return next();
  });
}