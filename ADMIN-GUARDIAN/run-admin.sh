#!/bin/bash

# KLOUD BUGS Mining Command Center - ADMIN VERSION
# Admin version without wallet access

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║   KLOUD BUGS Mining Command Center - ADMIN VERSION                         ║"
echo "║   Admin environment with management capabilities                           ║"
echo "║                                                                            ║"
echo "║   Starting server...                                                       ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"

# Set environment variables
export NODE_ENV=production
export GUARDIAN_MODE=false
export OWNER_ACCESS=false
export WALLET_ACCESS=false
export PLATFORM_ENV=admin

# Check if demo mode is requested
if [ "$1" == "--demo" ]; then
  echo "💥 Starting in DEMO MODE"
  export DEMO_MODE=true
  export DEMO_DATA=true
fi

# Start the server
cd "$(dirname "$0")" # Ensure we're in the ADMIN-READY directory
npm run dev