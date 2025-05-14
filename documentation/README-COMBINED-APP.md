# KLOUD BUGS Mining Command Center

A comprehensive Bitcoin mining management platform with tiered access levels for different user roles.

## Quick Start Guide

Choose your environment:

```bash
bash run-combined-app.sh
```

This interactive script will let you select which environment to run:

1. **GUARDIAN VERSION** - Owner access with full wallet functionality
2. **ADMIN VERSION** - Admin access without wallet transactions
3. **PUBLIC VERSION** - User-facing interface
4. **DEMO MODE** - Admin version with simulated data

## Available Environments

### ADMIN-GUARDIAN
Full owner-only environment with complete system access, including wallet operations and private key management.

### ADMIN-READY
Admin environment with management capabilities but without sensitive wallet operations. Safe to share with trusted administrative collaborators.

### PUBLIC-DEPLOYMENT
End-user facing interface with basic functionality for mining program participants.

## Documentation

For detailed information about the platform, please refer to these documents:

- [Platform Environments Guide](PLATFORM-ENVIRONMENTS-GUIDE.md) - Overview of the three environments
- [Technical Specification](TECHNICAL-SPECIFICATION.md) - Technical details and architecture

## Security Notice

The ADMIN-GUARDIAN environment contains sensitive wallet information and should never be shared. Only distribute the appropriate environment based on user role:

- Owner: ADMIN-GUARDIAN
- Administrators: ADMIN-READY
- End Users: PUBLIC-DEPLOYMENT