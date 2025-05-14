# KLOUD BUGS Mining Command Center

A comprehensive Bitcoin mining management platform with a three-tier architecture and modular deployment options.

## Three-Tier Architecture

This platform is divided into three separate environments, each designed for specific users and security levels:

### 1. ADMIN-GUARDIAN
Owner-only environment with full system access including wallet operations and private key management.

**Key Features:**
- Wallet transactions and private key management
- Transaction signing and broadcasting
- Full administrative control
- Complete system configuration

**Location:** `./ADMIN-GUARDIAN`

### 2. ADMIN-READY
Administrative environment with management capabilities but without sensitive wallet operations.

**Key Features:**
- User management and platform monitoring
- Mining configuration and optimization
- System analytics and reporting
- Demo mode for presentations

**Location:** `./ADMIN-READY`

### 3. PUBLIC-DEPLOYMENT
End-user facing interface with limited functionality for mining program participants.

**Key Features:**
- Personal mining dashboard
- Device configuration
- Rewards tracking
- User account management

**Location:** `./PUBLIC-DEPLOYMENT`

## Quick Start Guide

Run the combined launcher script to select which environment to run:

```bash
bash run-combined-app.sh
```

This interactive script will let you select:
1. **GUARDIAN VERSION** - Owner access with full wallet functionality
2. **ADMIN VERSION** - Admin access without wallet transactions
3. **PUBLIC VERSION** - User-facing interface
4. **DEMO MODE** - Admin version with simulated data

## Documentation

For more detailed information, refer to these documents:

- [Platform Environments Guide](PLATFORM-ENVIRONMENTS-GUIDE.md) - Detailed overview of the three environments
- [Technical Specification](TECHNICAL-SPECIFICATION.md) - Technical details and architecture
- [README for Combined App](README-COMBINED-APP.md) - How to run the combined application

## Security Notice

- **ADMIN-GUARDIAN** contains sensitive wallet information and should never be shared
- Each environment is completely isolated to prevent security breaches
- Share only the appropriate environment based on user role:
  - Owner: ADMIN-GUARDIAN
  - Administrators: ADMIN-READY
  - End Users: PUBLIC-DEPLOYMENT

## About KLOUD BUGS Mining

KLOUD BUGS Mining Command Center unifies diverse mining hardware under one platform while preserving original manufacturer brands. The platform features a cosmic-themed UI with messaging around "Crypto Mining for Justice" and the TERA token, which supports social justice initiatives focused on legal accountability.