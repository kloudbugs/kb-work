# 10zig Persistent Mining Setup Guide

This guide will help you create a persistent USB drive for your 10zig thin client that automatically boots Ubuntu and starts your Satoshi Bean Mining application.

## Required Materials

- 10zig thin client
- 16GB+ USB flash drive (32GB recommended)
- Temporary access to another computer to create the bootable USB
- Internet connection

## Step 1: Create a Persistent Ubuntu USB

### On Windows:
1. Download Rufus from [rufus.ie](https://rufus.ie/)
2. Download Ubuntu 20.04 LTS from [ubuntu.com](https://ubuntu.com/download/desktop)
3. Insert your USB drive
4. Open Rufus
5. Select your USB drive
6. Click SELECT and choose the Ubuntu ISO
7. In the Partition scheme menu, select "MBR"
8. Set the target system to "BIOS or UEFI"
9. **IMPORTANT:** Under "Persistent partition size", drag the slider to use all available space
10. Click START and accept any warnings

### On Mac:
1. Download Etcher from [balena.io/etcher](https://www.balena.io/etcher/)
2. Download Ubuntu 20.04 LTS from [ubuntu.com](https://ubuntu.com/download/desktop)
3. Insert your USB drive
4. Open Etcher
5. Select the Ubuntu ISO
6. Select your USB drive
7. Click Flash
8. After flashing, download and use [mkusb](https://help.ubuntu.com/community/mkusb) on another Ubuntu system to add persistence

## Step 2: First Boot and Setup

1. Insert the USB drive into your 10zig thin client
2. Power on and access the boot menu (usually F12 during startup)
3. Select boot from USB
4. Choose "Try Ubuntu without installing" option
5. After Ubuntu loads, connect to your WiFi network
6. Open Terminal (Ctrl+Alt+T)
7. Run the following commands:

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y curl git nodejs npm postgresql postgresql-contrib build-essential

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node -v
npm -v

# Set up automatic login (for your persistent USB)
sudo mkdir -p /etc/lightdm/lightdm.conf.d/
echo "[SeatDefaults]
autologin-user=ubuntu
autologin-user-timeout=0" | sudo tee /etc/lightdm/lightdm.conf.d/12-autologin.conf
```

## Step 3: Download and Configure Your Application

```bash
# Create a directory for your application
mkdir -p ~/satoshi-bean
cd ~/satoshi-bean

# Clone your application (replace with your actual repository)
# If you have a GitHub repository:
git clone https://github.com/yourusername/satoshi-bean-mining.git .

# If you downloaded from Replit:
# Connect another USB drive with your Replit export and copy the files

# Install dependencies
npm install

# Set up the database
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "CREATE USER satoshibean WITH PASSWORD 'mining';"
sudo -u postgres psql -c "CREATE DATABASE satoshibeandb OWNER satoshibean;"

# Configure environment variables
echo "DATABASE_URL=postgresql://satoshibean:mining@localhost:5432/satoshibeandb
PORT=3000
NODE_ENV=production
SESSION_SECRET=satoshibeanmining
WALLET_ADDRESS=your_bitcoin_wallet_address
ADMIN_PASSWORD=admin123" > .env

# Apply database migrations
npm run db:push

# Build the application
npm run build
```

## Step 4: Create Autostart Script

```bash
# Create a startup script
mkdir -p ~/.config/autostart
echo "[Desktop Entry]
Type=Application
Name=Satoshi Bean Mining
Exec=bash -c 'cd ~/satoshi-bean && npm run start'
Terminal=false
X-GNOME-Autostart-enabled=true" > ~/.config/autostart/satoshi-bean.desktop

# Make it executable
chmod +x ~/.config/autostart/satoshi-bean.desktop

# Create a desktop shortcut for the browser
echo "[Desktop Entry]
Type=Application
Name=Satoshi Bean Mining
Exec=firefox http://localhost:3000
Terminal=false
Icon=web-browser" > ~/Desktop/satoshi-bean.desktop
chmod +x ~/Desktop/satoshi-bean.desktop
```

## Step 5: Test the Setup

1. Restart your 10zig thin client
2. It should automatically boot to Ubuntu from the USB
3. The Satoshi Bean Mining application should start automatically
4. A browser should open to http://localhost:3000
5. Log in with your admin credentials

## Step 6: Optional Improvements

### Configure Autologin to Admin Account
```bash
# Automatically log in to the admin account in your app
echo "AUTH_AUTOLOGIN=true
AUTH_AUTOLOGIN_USERNAME=admin
AUTH_AUTOLOGIN_PASSWORD=admin123" >> .env
```

### Setup Auto-Updates
```bash
# Create a script to periodically update your application
echo '#!/bin/bash
cd ~/satoshi-bean
git pull
npm install
npm run build
pm2 restart satoshibean' > ~/update-app.sh
chmod +x ~/update-app.sh

# Add it to crontab to run daily
(crontab -l 2>/dev/null; echo "0 4 * * * ~/update-app.sh") | crontab -
```

### Power Management Settings
1. Open Settings
2. Go to Power
3. Set "Power Saving" to "Never"
4. Set "Screen Blank" to "Never"

## Troubleshooting

### If the application doesn't start automatically:
1. Open Terminal
2. Navigate to your application directory:
   ```bash
   cd ~/satoshi-bean
   ```
3. Start the application manually:
   ```bash
   npm run start
   ```
4. Check for any error messages

### If you have database connection issues:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL if needed
sudo systemctl restart postgresql
```

### If your 10zig boots to the wrong device:
1. Access the BIOS/boot settings (usually F2 or Del during startup)
2. Make sure USB boot is the first priority

---

This setup creates a fully functional, persistent Ubuntu system on a USB drive that will automatically start your Satoshi Bean Mining platform whenever you boot your 10zig thin client from the USB. All your data and settings will be saved between reboots as long as you use the same USB drive.