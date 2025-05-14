# KLOUD BUGS Mining Command Center - ADMIN VERSION

This is the administrative version of the KLOUD BUGS Mining Command Center platform. This version is designed for administrative collaborators who need access to most system functionality but do not require wallet transaction capabilities.

## Features

- Full administrative dashboard access
- User management
- Mining statistics and monitoring
- Token analytics and reports
- System status monitoring
- Community and social impact tracking
- AI system monitoring (without training capabilities)
- Demo mode for presentations

## Security Restrictions

For security reasons, this version does not include:

1. Wallet transaction functionality (transfer, sign, broadcast)
2. Secure wallet configuration and initialization
3. Access to private keys or sensitive wallet data
4. Security key rotation capabilities
5. Audit and access log viewing
6. AI model training (only monitoring)

These features are only available in the GUARDIAN version, which is intended for owner use only.

## Usage

To start the ADMIN version:

```bash
bash run-admin.sh
```

To start the ADMIN version in demo mode (for presentations):

```bash
bash run-admin.sh --demo
```

## Login Credentials

Default admin login:
- Username: admin
- Password: admin123

## Demo Mode

When running in demo mode, the system will:

1. Use simulated data for mining statistics
2. Show demo users and accounts
3. Simulate mining activity
4. Allow demonstration of features without affecting real data

Note that wallet operations are completely disabled in both regular and demo modes of this ADMIN version.

## Transferring to New Environments

This ADMIN version is designed to be self-contained and can be safely transferred to approved administrative collaborators. The folder contains everything needed to run independently.

**IMPORTANT**: Do not share the GUARDIAN version with anyone, as it contains sensitive wallet information.