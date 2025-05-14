#!/bin/bash

# KLOUD BUGS Mining Command Center - GUARDIAN VERSION
# Owner-only version with full wallet access

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║   KLOUD BUGS Mining Command Center - GUARDIAN VERSION                      ║"
echo "║   Owner-only environment with full wallet access                           ║"
echo "║                                                                            ║"
echo "║   Starting server...                                                       ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"

# Set environment variables
export NODE_ENV=production
export GUARDIAN_MODE=true
export OWNER_ACCESS=true
export WALLET_ACCESS=true
export PLATFORM_ENV=guardian

# Start the server
cd "$(dirname "$0")" # Ensure we're in the GUARDIAN directory
npm run dev