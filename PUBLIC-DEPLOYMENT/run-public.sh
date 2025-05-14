#!/bin/bash

# KLOUD BUGS Mining Command Center - PUBLIC VERSION
# End-user facing version

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║   KLOUD BUGS Mining Command Center - PUBLIC VERSION                        ║"
echo "║   End-user interface for program participants                              ║"
echo "║                                                                            ║"
echo "║   Starting server...                                                       ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"

# Set environment variables
export NODE_ENV=production
export GUARDIAN_MODE=false
export OWNER_ACCESS=false
export WALLET_ACCESS=false
export PLATFORM_ENV=public
export PUBLIC_MODE=true

# Start the server
cd "$(dirname "$0")" # Ensure we're in the PUBLIC-DEPLOYMENT directory
npm run dev