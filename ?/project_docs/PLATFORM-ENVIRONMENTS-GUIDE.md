# KLOUD BUGS Mining Command Center - Platform Environments Guide

The KLOUD BUGS Mining Command Center is organized into three separate environments, each designed for specific users with different security requirements and functionality.

## Overview of the Three-Tier Architecture

### 1. ADMIN-GUARDIAN Environment
**Location:** `./ADMIN-GUARDIAN` folder  
**Purpose:** Owner-only access with full system control including wallet operations  
**Features:**
- Complete wallet functionality with Bitcoin private key management
- Transaction creation, signing, and broadcasting
- System-wide administration and configuration
- User management with full permissions
- Sensitive data access and control

**Security Level:** Maximum - This environment contains private keys and should never be shared with anyone.

### 2. ADMIN-READY Environment
**Location:** `./ADMIN-READY` folder  
**Purpose:** Administrative access without sensitive wallet operations  
**Features:**
- User management and monitoring
- Mining configuration and optimization
- System monitoring and analytics
- Demo mode for presentations and training
- No access to private keys or transaction signing

**Security Level:** High - Safe to share with trusted administrators who should not have access to your private keys.

### 3. PUBLIC-DEPLOYMENT Environment
**Location:** `./PUBLIC-DEPLOYMENT` folder  
**Purpose:** End-user facing interface with limited functionality  
**Features:**
- Personal mining dashboard
- Device configuration
- Statistics and rewards viewing
- Token information
- Minimal administrative functions

**Security Level:** Standard - For distribution to platform users.

## Special Features

### Demo Mode
The ADMIN-READY environment includes a special demo mode that simulates mining operations, user data, and transactions. This mode is useful for:
- Sales presentations
- Training new administrators
- Testing interface changes without affecting real data
- Demonstrations without exposing real wallet information

To activate demo mode, run the combined launcher script and select option 4.

## Security Considerations

### Data Isolation
Each environment has its own isolated code and data, ensuring that sensitive information in the ADMIN-GUARDIAN environment cannot be accessed from other environments.

### Authentication
- **ADMIN-GUARDIAN:** Requires owner credentials with highest security level
- **ADMIN-READY:** Uses admin credentials (default: admin/admin123)
- **PUBLIC-DEPLOYMENT:** Standard user authentication

### Access Control
The platform implements role-based access control with three primary roles:
1. **Owner:** Full system access including wallet operations (ADMIN-GUARDIAN only)
2. **Admin:** System management without sensitive wallet operations (ADMIN-READY)
3. **User:** Limited functionality for personal account management (PUBLIC-DEPLOYMENT)

## Usage Guidelines

### When to Use Each Environment

- **ADMIN-GUARDIAN:** Use when you need to perform wallet operations, sign transactions, or manage sensitive cryptographic functions. Only you, as the owner, should ever access this environment.

- **ADMIN-READY:** Use for day-to-day administration, user management, system monitoring, and configuration. This environment is safe to share with trusted team members who need administrative access but should not have control of your wallet.

- **PUBLIC-DEPLOYMENT:** Use this for end-users of your mining platform. This environment provides only the functionality that regular users need without any administrative capabilities.

### Environment Customization

Each environment can be customized independently without affecting the others. This allows you to:
- Make changes to the PUBLIC-DEPLOYMENT interface without affecting admin functionality
- Update administrative tools in ADMIN-READY without exposing wallet operations
- Enhance security in the ADMIN-GUARDIAN environment without disrupting user experience

## Running the Platform

The platform includes a convenient launcher script that lets you choose which environment to run:

```bash
bash run-combined-app.sh
```

This script provides a menu where you can select:
1. **GUARDIAN VERSION** - Owner access with full wallet functionality
2. **ADMIN VERSION** - Admin access without wallet transactions
3. **PUBLIC VERSION** - User-facing interface
4. **DEMO MODE** - Admin version with simulated data

## Development Guidelines

When extending or modifying the platform:

1. Always maintain the separation between environments
2. Never copy wallet functionality from ADMIN-GUARDIAN to other environments
3. Test changes in the appropriate environment before deployment
4. Use the demo mode for testing administrative changes when possible
5. Remember that each environment has its own set of dependencies and configurations

By following this guide, you'll ensure the secure operation of your KLOUD BUGS Mining Command Center across all three environments.