# KLOUD BUGS Mining Command Center - Technical Specification

This document outlines the technical stack, languages, frameworks, and tools used in the development of the KLOUD BUGS Mining Command Center platform.

## Core Technologies

### Programming Languages
- **TypeScript**: Primary language for both frontend and backend components
- **JavaScript**: Used for utility scripts and compatibility
- **Bash**: Used for deployment scripts and environment management
- **SQL**: Used for database queries and data management

### Frontend Technologies
- **React**: Frontend UI library for building the user interface
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library based on Radix UI and styled with TailwindCSS
- **Framer Motion**: Animation library for UI elements
- **React Query**: Data fetching and state management
- **wouter**: Lightweight router for React applications
- **Recharts**: Charting library for data visualization
- **Zod**: Schema validation library

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **PostgreSQL**: Relational database for persistent storage
- **Express Session**: Session management middleware
- **Passport.js**: Authentication middleware
- **bcrypt**: Password hashing library
- **JSON Web Tokens (JWT)**: For secure authentication

### Blockchain Tools
- **bitcoinjs-lib**: Library for working with Bitcoin data
- **secp256k1**: Elliptic curve cryptography
- **bip32**: Bitcoin Improvement Proposal for HD wallets
- **bs58**: Base58 encoding/decoding for Bitcoin addresses
- **wif**: Working with Bitcoin's Wallet Import Format

### DevOps & Infrastructure
- **Replit**: Development, hosting, and deployment platform
- **nix**: Package management for reproducible environments
- **PM2**: Process manager for Node.js applications (production)
- **GitHub Actions**: CI/CD workflows for automated testing (optional)

### Security Tools
- **helmet**: Express middleware for securing HTTP headers
- **cors**: Cross-Origin Resource Sharing middleware
- **rate-limiter-flexible**: Rate limiting to prevent abuse
- **express-validator**: Input validation
- **dotenv**: Environment variable management
- **crypto**: Node.js cryptographic functionality

### AI Components
- **OpenAI API**: For AI-powered features and content generation
- **TensorFlow.js**: For local AI features (optional)
- **Hugging Face Transformers**: For NLP features (optional)

### Testing Tools
- **Jest**: JavaScript testing framework
- **supertest**: HTTP assertions for API testing
- **Cypress**: End-to-end testing framework (for critical paths)

## Architecture Overview

### Three-Tier Architecture
1. **Data Layer**: PostgreSQL database with Drizzle ORM for data persistence
2. **Application Layer**: Node.js + Express backend for business logic
3. **Presentation Layer**: React frontend for user interface

### Development Methodology
- **TypeScript**: Strict typing throughout the application
- **Component-Based Design**: Reusable UI components
- **REST API**: For communication between frontend and backend
- **Environment Isolation**: Complete separation between GUARDIAN, ADMIN, and PUBLIC deployments

### Security Architecture
- **Layered Security Model**: Multiple security checks and validations
- **Defense in Depth**: Security implemented at multiple levels
- **Least Privilege**: Access controls based on minimal required permissions
- **Secure by Default**: Conservative security defaults

## File Structure

```
project/
├── ADMIN-GUARDIAN/       # Owner-only environment with full access
├── ADMIN-READY/          # Admin environment with restricted access
├── PUBLIC-DEPLOYMENT/    # End-user facing environment
├── run-combined-app.sh   # Combined launcher script
├── PLATFORM-ENVIRONMENTS-GUIDE.md   # Environment documentation
└── TECHNICAL-SPECIFICATION.md       # This file
```

Each environment follows a similar structure:

```
environment/
├── client/             # Frontend React application
│   ├── src/              # Source code
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page layouts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── assets/         # Static assets
│   │   └── styles/         # CSS/style files
│   └── public/           # Static public files
├── server/             # Backend Express application
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── shared/             # Shared code between frontend and backend
│   ├── types/            # TypeScript type definitions
│   ├── schema.ts         # Zod schemas and Drizzle models
│   └── constants.ts      # Shared constants
└── run-[environment].sh  # Environment-specific launcher
```

## Performance Considerations

- **Code Splitting**: Implemented in the frontend to reduce initial load time
- **Tree Shaking**: Used to eliminate unused code
- **Optimistic UI**: Implemented for common operations to improve perceived performance
- **Caching**: Appropriately used at various levels
- **Lazy Loading**: For non-critical components and routes

## Accessibility

- **ARIA Attributes**: Properly implemented for UI components
- **Keyboard Navigation**: Fully supported
- **Color Contrast**: Meeting WCAG guidelines
- **Screen Reader Support**: Through semantic HTML and ARIA

## Maintenance and Extensibility

The codebase is designed to be maintainable and extensible:

- **Modular Design**: Components and services are highly decoupled
- **Consistent Patterns**: Following common patterns throughout the codebase
- **Comprehensive Documentation**: Both in code and separate documents
- **Strong Type System**: TypeScript used throughout to catch errors early
- **Testing**: Key components and critical paths are tested

## Deployment Process

The platform supports three distinct deployment scenarios:

1. **GUARDIAN**: Owner-only deployment with full capabilities
2. **ADMIN**: Administrative deployment with restricted capabilities
3. **PUBLIC**: End-user facing deployment with basic capabilities

Each environment can be deployed independently or as part of a unified system.