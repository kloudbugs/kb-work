# Setup Guide for Ubuntu on Mac

This guide is specifically for setting up the Satoshi Bean Mining platform on a 2017 Intel Mac that's currently running Ubuntu 20.04 LTS.

## Step 1: Download the Project from Replit

Since you're in Ubuntu, you can use the browser to:

1. In Replit, click the three dots (⋮) in the top-right corner
2. Select "Download as zip"
3. Save the ZIP file to your Downloads folder

## Step 2: Extract and Set Up the Project

Open a terminal and run:

```bash
# Create a directory for the project
mkdir -p ~/satoshi-bean-mining

# Move to the Downloads folder
cd ~/Downloads

# Extract the ZIP file (adjust the filename if needed)
unzip *.zip -d ~/satoshi-bean-mining

# Go to the project directory
cd ~/satoshi-bean-mining
```

## Step 3: Install Node.js Without Admin Rights (if needed)

If you don't have admin rights, you can install Node.js using NVM (Node Version Manager):

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load NVM (you may need to close and reopen the terminal)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js LTS version
nvm install --lts
nvm use --lts

# Verify installation
node -v
npm -v
```

## Step 4: Configure for Demo Mode (No Database)

Create an environment file with demo settings:

```bash
# Create .env file
cat > .env << EOL
PORT=3000
NODE_ENV=production
SESSION_SECRET=satoshibeanlocal
ADMIN_PASSWORD=admin123
WALLET_ADDRESS=bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps
DEMO_MODE=true
USE_MEMORY_STORAGE=true
EOL

# Create a modified starter script
cat > start-demo.js << EOL
// Simple starter script for demo mode
process.env.DEMO_MODE = 'true';
process.env.USE_MEMORY_STORAGE = 'true';
console.log('Starting Satoshi Bean Mining in Demo Mode');
require('./server/index.js');
EOL
```

## Step 5: Install Dependencies and Start

```bash
# Install dependencies
npm install

# Start in demo mode
node start-demo.js
```

The application should now be running at http://localhost:3000

## Step 6: Create a Desktop Shortcut

```bash
# Create a desktop file
cat > ~/Desktop/SatoshiMining.desktop << EOL
[Desktop Entry]
Name=Satoshi Bean Mining
Comment=Start Satoshi Bean Mining Platform
Exec=bash -c "cd ~/satoshi-bean-mining && node start-demo.js"
Terminal=true
Type=Application
Icon=terminal
EOL

# Make it executable
chmod +x ~/Desktop/SatoshiMining.desktop
```

## Step 7: Set Up Auto-Start on Boot

```bash
# Create a startup entry
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/satoshi-mining.desktop << EOL
[Desktop Entry]
Name=Satoshi Bean Mining
Comment=Start Satoshi Bean Mining Platform
Exec=bash -c "cd ~/satoshi-bean-mining && node start-demo.js"
Terminal=true
Type=Application
Icon=terminal
X-GNOME-Autostart-enabled=true
EOL
```

## Step 8: Prevent Ubuntu from Sleeping

1. Open Settings
2. Go to Power
3. Set "Blank Screen" to "Never"
4. Set "Automatic Suspend" to "Off"

## Troubleshooting

If you have issues starting the application:

```bash
# Check for errors by running directly
cd ~/satoshi-bean-mining
NODE_ENV=production DEMO_MODE=true USE_MEMORY_STORAGE=true node server/index.js

# Start with verbose logging
NODE_ENV=production DEMO_MODE=true USE_MEMORY_STORAGE=true DEBUG=* node server/index.js
```

## Viewing the Application

1. Open Firefox or Chrome browser
2. Go to http://localhost:3000
3. Log in with username "admin" and password "admin123"

## Running in Background (Keep Running After Terminal Closes)

To keep the application running even after closing the terminal:

```bash
# Install the 'screen' utility (if admin access is available)
sudo apt-get install screen

# If no admin access, create a background run script
cat > ~/run-in-background.sh << EOL
#!/bin/bash
nohup node ~/satoshi-bean-mining/start-demo.js > ~/satoshi-mining-output.log 2>&1 &
echo \$! > ~/satoshi-mining.pid
echo "Satoshi Bean Mining started in background (PID: \$(cat ~/satoshi-mining.pid))"
echo "View logs with: tail -f ~/satoshi-mining-output.log"
EOL

chmod +x ~/run-in-background.sh

# To start in background
~/run-in-background.sh

# To stop the background process
kill \$(cat ~/satoshi-mining.pid)
```

## Benefits of Running on Ubuntu

Running on Ubuntu (even on a Mac) offers several advantages:

1. Better memory management than macOS for long-running processes
2. More efficient use of older hardware
3. Lower system overhead, leaving more resources for mining
4. Built-in terminal for easier troubleshooting
5. Simpler auto-start configuration

---

This setup allows you to run your Satoshi Bean Mining platform smoothly on your 2017 Intel Mac that's currently running Ubuntu. The demo mode lets you use all the ghost account functionality without needing a database.