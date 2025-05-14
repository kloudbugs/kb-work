#!/bin/bash

# KLOUD BUGS Mining Command Center
# Combined Launcher Script
# 
# This script provides a menu to select which environment to launch:
# 1. ADMIN-GUARDIAN - Full owner access with wallet operations
# 2. ADMIN-READY - Admin access without sensitive wallet functions
# 3. PUBLIC-DEPLOYMENT - End-user facing interface
# 4. ADMIN-READY (DEMO MODE) - Admin interface with simulated data

# Set terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear screen
clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║  ${BOLD}KLOUD BUGS Mining Command Center${NC}                              ${BLUE}║${NC}"
echo -e "${BLUE}║  ${YELLOW}Combined Environment Launcher${NC}                                 ${BLUE}║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo

echo -e "${CYAN}This launcher allows you to select which environment to run.${NC}"
echo -e "${CYAN}Please select the appropriate version for your access level.${NC}"
echo

echo -e "${BOLD}Available Environments:${NC}"
echo -e "  ${GREEN}1)${NC} ${BOLD}GUARDIAN VERSION${NC} - Owner access with full wallet functionality"
echo -e "     ${CYAN}• Complete system access including Bitcoin wallet operations${NC}"
echo -e "     ${CYAN}• Private key management and transaction signing${NC}"
echo -e "     ${CYAN}• Full administrative control${NC}"
echo -e "     ${RED}• SECURITY NOTICE: This environment contains sensitive information${NC}"
echo
echo -e "  ${GREEN}2)${NC} ${BOLD}ADMIN VERSION${NC} - Admin access without wallet transactions"
echo -e "     ${CYAN}• User management, mining configuration, and system monitoring${NC}"
echo -e "     ${CYAN}• Platform customization and statistics${NC}"
echo -e "     ${CYAN}• No access to wallet private keys or transaction signing${NC}"
echo
echo -e "  ${GREEN}3)${NC} ${BOLD}PUBLIC VERSION${NC} - User-facing interface"
echo -e "     ${CYAN}• Mining dashboard and personal statistics${NC}"
echo -e "     ${CYAN}• Device configuration and monitoring${NC}"
echo -e "     ${CYAN}• Limited functionality for end-users${NC}"
echo
echo -e "  ${GREEN}4)${NC} ${BOLD}DEMO MODE${NC} - Admin version with simulated data"
echo -e "     ${CYAN}• Same interface as the admin version${NC}"
echo -e "     ${CYAN}• Simulated data for presentations and training${NC}"
echo -e "     ${CYAN}• No connection to real wallet or transaction systems${NC}"
echo
echo -e "  ${GREEN}0)${NC} ${BOLD}Exit${NC}"
echo

# Read user choice
read -p "Enter your choice (0-4): " choice
echo

case $choice in
    1)
        echo -e "${YELLOW}Launching GUARDIAN VERSION...${NC}"
        if [ -f "./ADMIN-GUARDIAN/run-guardian.sh" ]; then
            # Make sure the script is executable
            chmod +x ./ADMIN-GUARDIAN/run-guardian.sh
            # Run the script
            ./ADMIN-GUARDIAN/run-guardian.sh
        else
            echo -e "${RED}Error: Guardian launcher script not found.${NC}"
            exit 1
        fi
        ;;
    2)
        echo -e "${YELLOW}Launching ADMIN VERSION...${NC}"
        if [ -f "./ADMIN-READY/run-admin.sh" ]; then
            # Make sure the script is executable
            chmod +x ./ADMIN-READY/run-admin.sh
            # Run the script with demo mode disabled
            DEMO_MODE=false ./ADMIN-READY/run-admin.sh
        else
            echo -e "${RED}Error: Admin launcher script not found.${NC}"
            exit 1
        fi
        ;;
    3)
        echo -e "${YELLOW}Launching PUBLIC VERSION...${NC}"
        if [ -f "./PUBLIC-DEPLOYMENT/run-public.sh" ]; then
            # Make sure the script is executable
            chmod +x ./PUBLIC-DEPLOYMENT/run-public.sh
            # Run the script
            ./PUBLIC-DEPLOYMENT/run-public.sh
        else
            echo -e "${RED}Error: Public launcher script not found.${NC}"
            exit 1
        fi
        ;;
    4)
        echo -e "${YELLOW}Launching DEMO MODE...${NC}"
        if [ -f "./ADMIN-READY/run-admin.sh" ]; then
            # Make sure the script is executable
            chmod +x ./ADMIN-READY/run-admin.sh
            # Run the script with demo mode enabled
            DEMO_MODE=true ./ADMIN-READY/run-admin.sh
        else
            echo -e "${RED}Error: Demo launcher script not found.${NC}"
            exit 1
        fi
        ;;
    0)
        echo -e "${YELLOW}Exiting launcher...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again and select a valid option.${NC}"
        exit 1
        ;;
esac