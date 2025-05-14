# KLOUD BUGS Mining Command Center - Development Stack

This document outlines the programming languages, frameworks, libraries, and tools used to develop the KLOUD BUGS Mining Command Center platform.

## Primary Programming Languages

- **TypeScript**: Main language used for both frontend and backend development
- **JavaScript**: Supporting language for compatibility with certain libraries
- **HTML/CSS**: Front-end markup and styling (via JSX in React components)
- **SQL**: Database queries via Drizzle ORM

## Core Technologies

### Frontend

- **React**: UI component library for building the user interface
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Framer Motion**: Animation library for smooth UI transitions
- **Recharts**: Charting library for data visualization
- **Wouter**: Lightweight router for page navigation
- **React Query**: Data fetching and state management
- **Zod**: Schema validation

### Backend

- **Node.js**: JavaScript runtime for server-side code
- **Express**: Web server framework
- **Drizzle ORM**: Database ORM for type-safe SQL queries
- **PostgreSQL**: Primary database for data storage
- **bcrypt**: Password hashing for user authentication
- **express-session**: Session management
- **passport**: Authentication middleware
- **ws**: WebSockets implementation for real-time data

### Blockchain-Specific

- **bitcoinjs-lib**: Bitcoin operations and wallet functionality
- **ecpair**: Key pair management for Bitcoin
- **secp256k1**: Cryptographic library for elliptic curve operations
- **bs58/bs58check**: Base58 encoding used in Bitcoin addresses
- **bip32**: Implementation of BIP32 HD wallets
- **wif**: Wallet Import Format utilities

### Payment Processing

- **Stripe**: Payment processing (includes @stripe/stripe-js and @stripe/react-stripe-js)

### AI & Communication

- **OpenAI API**: AI-powered features integration
- **Neon Database**: ServerLess PostgreSQL for cloud data storage
- **SendGrid**: Email service for notifications and communications

## Development Tools

- **TypeScript Compiler**: Static type checking and transpilation
- **ESLint**: Code quality and style enforcement
- **npm**: Package management
- **drizzle-kit**: Database migration tools
- **Replit**: Development environment and deployment platform

## Design & UI Assets

- **Lucide React**: Icon library
- **React Icons**: Additional icon library
- **Custom Fonts**: Various font families for styled typography
  - Great Vibes
  - Dancing Script
  - Pinyon Script
  - Tangerine

## Deployment & Infrastructure

- **Replit Deployments**: Hosting and deployment
- **Express Static Middleware**: Serving static assets
- **Memory Store**: Session storage
- **Neon Database (PostgreSQL)**: Cloud database service
- **Connect PG Simple**: PostgreSQL session store

## Testing & Debugging

- **React Developer Tools**: Frontend debugging
- **Vite Dev Tools**: Development server enhancements
- **Manual testing scripts**: Various utility scripts for testing blockchain operations

## Security Features

- **bcrypt**: Password hashing
- **express-session**: Session management
- **zod**: Input validation
- **Middleware authentication**: Route protection
- **PostgreSQL**: Secure data storage
- **Role-based access control**: User permission management
- **OTPlib**: Two-factor authentication
- **QRCode**: Generation of QR codes for 2FA

## Build & Configuration Tools

- **Vite Config**: Build configuration
- **Tailwind Config**: Styling system configuration
- **PostCSS**: CSS processing
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependency management

This platform leverages modern web development practices with a focus on type safety, security, and modular architecture. The separation between environments (GUARDIAN, ADMIN-READY, PUBLIC-DEPLOYMENT) is maintained through careful middleware configuration and deployment strategies.