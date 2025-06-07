# Bitcoin Mining Pool Application

A sophisticated Bitcoin mining web application with real-time monitoring, automatic payouts, and professional mining pool functionality.

## Features

- 🚀 Real-time hashrate monitoring
- 💰 Automatic pool payouts at withdrawal thresholds
- 📊 Live earnings analytics and statistics
- 🔗 WebSocket connections for instant updates
- 🗄️ PostgreSQL database for data persistence
- ⚡ Professional mining dashboard interface

## Deployment

### Railway (Recommended)

1. Create account at [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy with one click
4. Add PostgreSQL database service
5. Configure custom domain (kloudbugscafe.com)

### Environment Variables

Required for BTCPay Server integration:
- `BTCPAY_SERVER_URL`
- `BTCPAY_API_KEY` 
- `BTCPAY_STORE_ID`

### Database Setup

The app uses PostgreSQL with automatic schema migrations. Tables are created automatically on first run.

## Local Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

Built with TypeScript, Express, React, and modern web technologies for a professional mining pool experience.