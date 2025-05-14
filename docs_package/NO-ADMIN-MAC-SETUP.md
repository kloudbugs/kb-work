# Mac Setup Guide Without Admin Access

This guide will help you set up your Satoshi Bean Mining platform on a 2017 Intel Mac without requiring any admin commands or privileges.

## Step 1: Download the Project

1. In Replit, click the three dots (⋮) in the top-right corner
2. Select "Download as zip"
3. Save the ZIP file to your Mac's Downloads folder

## Step 2: Extract the Project

1. Double-click the ZIP file in your Downloads folder to extract it
2. Rename the extracted folder to "SatoshiBeanMining" for simplicity
3. Move this folder to your Documents folder

## Step 3: Use NVM to Install Node.js Without Admin Rights

Node Version Manager (NVM) allows you to install Node.js without admin privileges:

1. Open Terminal (Applications → Utilities → Terminal)
2. Install NVM without admin rights:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   ```
3. Close and reopen Terminal, or run:
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```
4. Install Node.js using NVM:
   ```bash
   nvm install 16
   nvm use 16
   ```
5. Verify Node.js installation:
   ```bash
   node --version
   npm --version
   ```

## Step 4: Configure the Project for User-Level Operation

1. Navigate to your project folder:
   ```bash
   cd ~/Documents/SatoshiBeanMining
   ```

2. Create a special config for demo mode (without database):
   ```bash
   cat > .env << EOL
   PORT=3333
   NODE_ENV=production
   SESSION_SECRET=satoshibeanlocal
   WALLET_ADDRESS=bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps
   ADMIN_PASSWORD=admin123
   DEMO_MODE=true
   USE_MEMORY_STORAGE=true
   EOL
   ```

3. Create a modified start script that works without a database:
   ```bash
   cat > start-local.js << EOL
   // Modified starter script for no-admin setup
   process.env.DEMO_MODE = 'true';
   process.env.USE_MEMORY_STORAGE = 'true';
   process.env.PORT = process.env.PORT || 3333;
   require('./server/index.js');
   console.log('Starting Satoshi Bean Mining in Demo Mode on port ' + (process.env.PORT || 3333));
   EOL
   ```

## Step 5: Install Required Dependencies

```bash
# Install only necessary packages
npm install --no-optional

# If the full install fails, try a minimal install
# npm install express react react-dom ws
```

## Step 6: Create a Simple Launcher

1. Create a bash script to launch the application:
   ```bash
   cat > launch-mining.sh << EOL
   #!/bin/bash
   cd ~/Documents/SatoshiBeanMining
   source ~/.nvm/nvm.sh
   nvm use 16
   node start-local.js
   EOL
   ```

2. Make the launcher executable:
   ```bash
   chmod +x launch-mining.sh
   ```

## Step 7: Launch the Application

1. Run the launcher script:
   ```bash
   ~/Documents/SatoshiBeanMining/launch-mining.sh
   ```

2. Open a web browser (Safari or Chrome)
3. Go to http://localhost:3333
4. Log in with username "admin" and password "admin123"

## Keep Your Mac Awake While Mining (No Admin Required)

1. Download "Caffeine" from the Mac App Store (free app that prevents sleep)
2. Launch Caffeine and click its icon to enable it
3. Alternative: Use the built-in "caffeinate" command in Terminal:
   ```bash
   # Keep Mac awake while terminal is open
   caffeinate -d
   ```

## Create a Simple Auto-Launcher at Login (No Admin Required)

1. Open System Preferences
2. Go to Users & Groups
3. Click on your user account
4. Click on "Login Items"
5. Click the + button
6. Navigate to Applications → Utilities → Terminal
7. Click "Add"

8. Create an automatic startup script:
   ```bash
   cat > ~/Library/LaunchAgents/com.user.satoshibean.plist << EOL
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.user.satoshibean</string>
       <key>ProgramArguments</key>
       <array>
           <string>/bin/bash</string>
           <string>-c</string>
           <string>~/Documents/SatoshiBeanMining/launch-mining.sh</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
       <key>StandardOutPath</key>
       <string>~/Documents/SatoshiBeanMining/stdout.log</string>
       <key>StandardErrorPath</key>
       <string>~/Documents/SatoshiBeanMining/stderr.log</string>
   </dict>
   </plist>
   EOL
   
   # Load the agent (doesn't require admin)
   launchctl load ~/Library/LaunchAgents/com.user.satoshibean.plist
   ```

## Running Without Database

Since we're using demo mode, you'll still have access to:

- Ghost accounts functionality for simulating users and mining activity
- Admin dashboard with mining simulator controls
- Satoshi Bean Mining interface and basic features

You won't have access to features requiring real database storage, like:
- Persistent user accounts (besides the admin account)
- Transaction history for real mining rewards
- Long-term statistics and data

## Checking Logs and Troubleshooting

```bash
# View application logs
cat ~/Documents/SatoshiBeanMining/stdout.log
cat ~/Documents/SatoshiBeanMining/stderr.log

# If the app doesn't start, try running it directly to see errors
cd ~/Documents/SatoshiBeanMining
node start-local.js
```

## Creating a Shortcut on Your Desktop

1. Open TextEdit
2. Create a new document with this content:
   ```
   tell application "Terminal" to do script "~/Documents/SatoshiBeanMining/launch-mining.sh"
   tell application "Safari" to open location "http://localhost:3333"
   ```
3. Save as "Launch Satoshi Mining.app" (make sure to select File Format: Application in the save dialog)
4. Move this application to your Desktop for easy access

---

This setup allows you to run your Satoshi Bean Mining platform on the 2017 Intel Mac without requiring any admin privileges. The application will run in demo mode, allowing you to use the ghost accounts and simulation features.