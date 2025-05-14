# KLOUD BUGS Mining Command Center - Platform Migration Guide

This guide provides comprehensive instructions for migrating the KLOUD BUGS platform to a new environment or starting fresh while preserving your configuration and data.

## Platform Components Overview

The platform consists of these main components:

1. **Core Application**: The main KLOUD BUGS Mining Command Center application
2. **Admin Systems**: Administrative tools and interfaces
3. **User Interface**: The public-facing components
4. **Database**: User accounts, mining data, and transactions
5. **Configuration**: System settings and preferences
6. **Secure Wallet System**: The isolated wallet management component

## Prerequisites

Before beginning migration, ensure you have:

- Access to both source and destination environments
- Administrative privileges on both systems
- Secure backup of all data
- Required system dependencies installed on the new environment
- Network connectivity between environments (if performing live migration)

## Step 1: Environment Setup

```bash
# Create project directory structure
mkdir -p kloud-bugs/{ADMIN-GUARDIAN,ADMIN-READY,PUBLIC-DEPLOYMENT}

# Clone the repository to new environment (if applicable)
git clone [YOUR_PRIVATE_REPOSITORY_URL] kloud-bugs

# Install dependencies
cd kloud-bugs
npm install
```

## Step 2: Configuration Transfer

The configuration files contain your system settings but not sensitive credentials.

```bash
# Copy configuration files
cp -r /source/ADMIN-READY/configurations/* /destination/ADMIN-READY/configurations/

# Copy non-sensitive environment settings
cp /source/ADMIN-READY/secrets/environment-template.ts /destination/ADMIN-READY/secrets/
```

## Step 3: Database Migration

### Option A: Full Database Migration

```bash
# Export database to file
npm run db:export -- --output=database-backup.sql

# Transfer file to new environment

# Import database in new environment
npm run db:import -- --input=database-backup.sql
```

### Option B: Fresh Database with Settings Preserved

```bash
# Initialize new database
npm run db:init

# Import system settings only
npm run db:import-settings -- --input=settings-backup.json
```

## Step 4: Secure Wallet Setup

The secure wallet system requires special handling:

1. **Never** transfer private keys via email or unencrypted channels
2. Set up new wallet system in the destination environment
3. Initialize with your Bitcoin private key (manually entered)

```bash
# Set up wallet system directories
mkdir -p /destination/ADMIN-READY/secure-wallet-system

# Copy wallet configuration template
cp /source/ADMIN-READY/secure-wallet-system/wallet-config.ts /destination/ADMIN-READY/secure-wallet-system/

# NEVER COPY ACTUAL PRIVATE KEYS - Manual entry required
# Follow the secure key import process in the admin interface
```

## Step 5: User Interface Deployment

```bash
# Copy public deployment files
cp -r /source/PUBLIC-DEPLOYMENT/* /destination/PUBLIC-DEPLOYMENT/

# Build the user interface
cd /destination
npm run build
```

## Step 6: Testing the Migration

Before going live, test all components:

1. Start the application in test mode: `npm run dev`
2. Verify admin access functionality
3. Test mining simulation
4. Confirm user authentication
5. Validate database connections
6. Test token management features

## Step 7: Going Live

Once all tests pass:

```bash
# Start the production server
npm run start:prod

# Enable monitoring
npm run monitoring:enable
```

## Special Considerations

### Private Key Handling

- **NEVER** include private keys in backups or repository
- Store your private key in a secure, offline location
- Only enter your private key when setting up the wallet system on a trusted device

### User Data Migration

If migrating user accounts:

1. Notify users before migration
2. Schedule maintenance window
3. Consider password reset requirement after migration for security
4. Verify successful migration of sensitive user data

### Demo Mode

The demo mode is perfect for testing or showcasing the platform:

```bash
# Enable demo mode
npm run enable:demo

# Start with demo credentials
# Username: admin
# Password: admin123
```

## Troubleshooting Common Migration Issues

### Database Connection Errors

```bash
# Check database connection
npm run db:check

# Repair database if needed
npm run db:repair
```

### Missing Dependencies

```bash
# Verify all dependencies are installed
npm run check:deps

# Install missing dependencies
npm run install:missing
```

### Configuration Conflicts

```bash
# Validate configuration
npm run config:validate

# Reset to defaults if needed
npm run config:reset
```

## Support and Resources

If you encounter issues during migration, refer to:

- Detailed documentation in `/ADMIN-READY/documentation/`
- Technical support contacts in `/ADMIN-READY/support-contacts.md`
- Emergency procedures in `/ADMIN-READY/emergency-procedures.md`

---

By following this guide, you should be able to successfully migrate the KLOUD BUGS Mining Command Center to a new environment while maintaining all functionality and security.