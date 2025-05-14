# Complete Setup Guide for Older Mac

This comprehensive guide will help you set up the Satoshi Bean Mining platform on your older Mac system, focusing on ease of installation and minimal resource usage.

## Step 1: Get the Project from Replit

1. In your Replit project, click the three dots (⋮) in the top-right corner
2. Select "Download as zip"
3. Save the file to your Mac's Downloads folder

## Step 2: Prepare Your Mac

1. **Clean Up Disk Space** (optional but recommended)
   - Empty the Trash
   - Delete unused applications
   - Clear browser caches

2. **Update System Settings for Performance**
   - Open System Preferences → Energy Saver
   - Set "Computer sleep" to "Never"
   - Uncheck "Put hard disks to sleep when possible"
   - Check "Prevent computer from sleeping automatically when the display is off"

## Step 3: Install Node.js

Since your Mac might be running an older version of macOS, we'll use the safest method to install Node.js:

1. Visit https://nodejs.org/en/download/
2. Download the macOS Installer (.pkg) for the LTS version
3. Run the installer and follow the prompts
4. After installation, verify by opening Terminal and typing:
   ```bash
   node --version
   npm --version
   ```

## Step 4: Set Up the Project

1. Extract the ZIP file you downloaded from Replit
   - Double-click the ZIP file in your Downloads folder
   - It will create a folder with your project

2. Rename and move the folder for easier access
   ```bash
   # Open Terminal
   cd ~/Downloads
   # Rename the extracted folder (adjust the name as needed)
   mv replit-code-export satoshi-bean
   # Move to the home directory
   mv satoshi-bean ~/
   ```

3. Configure the project for demo mode (no database required)
   ```bash
   # Navigate to your project
   cd ~/satoshi-bean
   
   # Create environment file for demo mode
   cat > .env << EOL
   PORT=3000
   NODE_ENV=production
   SESSION_SECRET=satoshibeansecret
   ADMIN_PASSWORD=admin123
   WALLET_ADDRESS=bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps
   DEMO_MODE=true
   USE_MEMORY_STORAGE=true
   EOL
   
   # Create a simplified starter script
   cat > start-mining.js << EOL
   // Modified starter script for demo mode
   process.env.DEMO_MODE = 'true';
   process.env.USE_MEMORY_STORAGE = 'true';
   
   console.log('===================================');
   console.log('  Satoshi Bean Mining Platform');
   console.log('  Running in DEMO MODE');
   console.log('===================================');
   console.log('  - No database required');
   console.log('  - Ghost user simulation enabled');
   console.log('  - Admin login: admin / admin123');
   console.log('  - Web interface: http://localhost:3000');
   console.log('===================================');
   
   require('./server/index.js');
   EOL
   ```

## Step 5: Install Dependencies and Start

```bash
# Navigate to your project
cd ~/satoshi-bean

# Install only necessary dependencies (simplified for older Macs)
npm install --production

# Start the application
node start-mining.js
```

The application should now be running. Open Safari or Chrome and navigate to http://localhost:3000

## Step 6: Login to the Admin Interface

1. Open http://localhost:3000 in your browser
2. Click "Login" in the top-right corner
3. Enter username: `admin` and password: `admin123`
4. You should now have access to the admin dashboard

## Step 7: Create Auto-Start Scripts

Let's create scripts to easily start and manage your mining application:

```bash
# Create a scripts directory
mkdir -p ~/satoshi-bean/scripts

# Create a start script
cat > ~/satoshi-bean/scripts/start.command << EOL
#!/bin/bash
cd ~/satoshi-bean
node start-mining.js
EOL

# Create a background start script
cat > ~/satoshi-bean/scripts/start-background.command << EOL
#!/bin/bash
cd ~/satoshi-bean
nohup node start-mining.js > mining.log 2>&1 &
echo \$! > mining.pid
echo "Satoshi Bean Mining started in background (PID: \$(cat mining.pid))"
echo "View logs with: tail -f ~/satoshi-bean/mining.log"
echo "Stop with: ~/satoshi-bean/scripts/stop.command"
EOL

# Create a stop script
cat > ~/satoshi-bean/scripts/stop.command << EOL
#!/bin/bash
if [ -f ~/satoshi-bean/mining.pid ]; then
  PID=\$(cat ~/satoshi-bean/mining.pid)
  echo "Stopping Satoshi Bean Mining (PID: \$PID)..."
  kill \$PID
  rm ~/satoshi-bean/mining.pid
  echo "Stopped."
else
  echo "No running instance found."
fi
EOL

# Create a status checker script
cat > ~/satoshi-bean/scripts/status.command << EOL
#!/bin/bash
echo "===== Satoshi Bean Mining Status ====="
if [ -f ~/satoshi-bean/mining.pid ]; then
  PID=\$(cat ~/satoshi-bean/mining.pid)
  if ps -p \$PID > /dev/null; then
    echo "Status: RUNNING (PID: \$PID)"
    echo "Memory usage: \$(ps -o rss= -p \$PID | awk '{printf "%.2f MB", \$1/1024}')"
    echo "Running since: \$(ps -p \$PID -o lstart=)"
    echo "View logs: tail -f ~/satoshi-bean/mining.log"
  else
    echo "Status: NOT RUNNING (stale PID file)"
    rm ~/satoshi-bean/mining.pid
  fi
else
  echo "Status: NOT RUNNING"
fi
echo "====================================="
EOL

# Make all scripts executable
chmod +x ~/satoshi-bean/scripts/*.command
```

## Step 8: Create Desktop Shortcuts

1. Find the scripts in Finder at ~/satoshi-bean/scripts
2. Drag each .command file to your Desktop for easy access
3. Double-click start.command to start the mining application

## Step 9: Auto-Start on Login (Optional)

To make your mining application start automatically when you log in:

1. Open System Preferences
2. Click on Users & Groups
3. Select your user account
4. Click on Login Items
5. Click the + button
6. Navigate to ~/satoshi-bean/scripts
7. Select start-background.command and click Add

## Step 10: Keep Your Mac Running Efficiently

1. **Disable unnecessary visual effects**
   - System Preferences → Accessibility → Display → Reduce motion

2. **Close other applications**
   - Close all applications you don't need while mining

3. **Monitor system health**
   - Use the status.command script to check on your mining process
   - Open Activity Monitor to see overall system performance

## Using the Ghost Account Simulator

1. Login to the admin dashboard (admin/admin123)
2. Go to the "Ghost Users" tab
3. Use the controls to simulate mining activity
4. Adjust settings as needed to optimize performance on your older Mac

## Troubleshooting

If you have issues with the application:

1. **Check if the application is running**
   ```bash
   ~/satoshi-bean/scripts/status.command
   ```

2. **View application logs**
   ```bash
   tail -f ~/satoshi-bean/mining.log
   ```

3. **Restart the application**
   ```bash
   ~/satoshi-bean/scripts/stop.command
   ~/satoshi-bean/scripts/start.command
   ```

4. **If dependencies fail to install**
   ```bash
   # Try a more minimal install
   cd ~/satoshi-bean
   npm install express react react-dom
   ```

## Additional Tips for Older Macs

1. **Optimize browser performance**
   - Use Safari instead of Chrome for better performance on older Macs
   - Keep only the mining tab open and close other tabs

2. **Consider using 'App Nap' disabler**
   - Download "App Tamer" or similar utility to prevent macOS from reducing resources to your mining process

3. **Connect to power**
   - Keep your Mac plugged in to prevent performance throttling due to battery saving

---

This setup provides a complete solution for running your Satoshi Bean Mining platform on your older Mac with minimal resource usage. The demo mode ensures you can run the application without needing a database, while still having access to all the ghost account functionality for simulating mining activity.