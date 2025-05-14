# Mac Setup Guide for Satoshi Bean Mining Platform

This guide provides instructions for setting up your Satoshi Bean Mining platform on a Mac, including both Intel and Apple Silicon (M1/M2) processors.

## System Requirements
- macOS 10.15 (Catalina) or newer
- 4GB RAM minimum (8GB+ recommended)
- 10GB free disk space
- Administrator access to your Mac

## Step 1: Install Required Software

### Install Homebrew
Homebrew is a package manager for macOS that makes installing developer tools easy.

1. Open Terminal (Applications → Utilities → Terminal)
2. Install Homebrew:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Follow the prompts and enter your password when requested
4. After installation, add Homebrew to your PATH if prompted

### Install Node.js and Other Dependencies
```bash
# Install Node.js 18.x
brew install node@18

# Add Node to your PATH if needed
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Apple Silicon (M1/M2) Macs
# echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
# source ~/.zshrc

# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL and enable auto-start
brew services start postgresql

# Install Git (if not already installed)
brew install git
```

## Step 2: Set Up PostgreSQL Database

```bash
# Create a database user and database
psql postgres -c "CREATE USER satoshibean WITH PASSWORD 'mining';"
psql postgres -c "CREATE DATABASE satoshibeandb OWNER satoshibean;"
```

## Step 3: Download and Configure Your Application

### Option 1: Download from Replit
1. Export your Replit project as a ZIP file
2. Extract the ZIP file to a location on your Mac

### Option 2: Clone from GitHub (if available)
```bash
# Create a directory for your application
mkdir -p ~/satoshi-bean
cd ~/satoshi-bean

# Clone your repository (replace with actual URL)
git clone https://github.com/yourusername/satoshi-bean-mining.git .
```

### Configure Your Application
```bash
# Navigate to your project directory
cd ~/satoshi-bean

# Install dependencies
npm install

# Create environment file
cat > .env << EOL
DATABASE_URL=postgresql://satoshibean:mining@localhost:5432/satoshibeandb
PORT=3000
NODE_ENV=development
SESSION_SECRET=macsatoshibeanmining
WALLET_ADDRESS=your_bitcoin_wallet_address
ADMIN_PASSWORD=admin123
EOL

# Initialize the database
npm run db:push
```

## Step 4: Start the Application

```bash
# Build the application
npm run build

# Start in development mode (for testing)
npm run dev

# For production use
# npm run start
```

The application should now be running at http://localhost:3000

## Step 5: Set Up Auto-Start on Login (Optional)

Create a Launch Agent to automatically start your application when you log in:

```bash
# Create a Launch Agent plist file
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/com.satoshibean.mining.plist << EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.satoshibean.mining</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/sh</string>
        <string>-c</string>
        <string>cd ~/satoshi-bean && npm run start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>~/satoshi-bean/stdout.log</string>
    <key>StandardErrorPath</key>
    <string>~/satoshi-bean/stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
</dict>
</plist>
EOL

# Load the Launch Agent
launchctl load ~/Library/LaunchAgents/com.satoshibean.mining.plist
```

## Step 6: Create a Desktop Shortcut (Optional)

1. Open Script Editor (Applications → Utilities → Script Editor)
2. Paste the following:
   ```applescript
   tell application "Safari" to open location "http://localhost:3000"
   ```
3. Save as an Application to your Desktop with the name "Satoshi Bean Mining"
4. Add a custom icon:
   - Find a suitable PNG image
   - Select the PNG and press Cmd+C to copy
   - Select your application in Finder, press Cmd+I to show info
   - Click the icon in the top left of the info window
   - Press Cmd+V to paste your new icon

## Step 7: Optimize Mac Performance for Mining

### Disable Sleep Mode
1. Open System Preferences → Energy Saver/Battery
2. Set "Turn display off after" to "Never"
3. Uncheck "Put hard disks to sleep when possible"
4. Check "Prevent computer from sleeping automatically when the display is off"

### Improve Network Stability
1. Open System Preferences → Network
2. Select your active connection and click "Advanced"
3. Go to the "Hardware" tab
4. Set "Configure" to "Manually"
5. Set "MTU" to "1500"
6. Click "OK" and "Apply"

## Troubleshooting

### If You Have Database Connection Issues:
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL if needed
brew services restart postgresql
```

### If Node.js Commands Aren't Found:
```bash
# Check Node.js installation
which node
node -v

# For Intel Macs, add to PATH if needed
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Apple Silicon (M1/M2) Macs
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### If the App Crashes or Won't Start:
```bash
# Check application logs
cat ~/satoshi-bean/stdout.log
cat ~/satoshi-bean/stderr.log

# Try running manually to see errors
cd ~/satoshi-bean
npm run start
```

## Updating Your Application

```bash
# Navigate to your project directory
cd ~/satoshi-bean

# Pull latest changes (if using Git)
git pull

# Update dependencies
npm install

# Rebuild the application
npm run build

# Restart the application
launchctl unload ~/Library/LaunchAgents/com.satoshibean.mining.plist
launchctl load ~/Library/LaunchAgents/com.satoshibean.mining.plist
```

## Backup Your Data

Regularly backup your database to prevent data loss:

```bash
# Create a backup script
mkdir -p ~/backups
cat > ~/backup-mining-db.sh << EOL
#!/bin/bash
pg_dump -U satoshibean satoshibeandb > ~/backups/satoshibeandb_\$(date +%Y-%m-%d).sql
EOL
chmod +x ~/backup-mining-db.sh

# Run backup manually
~/backup-mining-db.sh

# Add to crontab to run weekly
(crontab -l 2>/dev/null; echo "0 0 * * 0 ~/backup-mining-db.sh") | crontab -
```

---

This setup provides you with a fully functional Satoshi Bean Mining platform running natively on your Mac. The Mac's better processing power makes it ideal for mining operations compared to a thin client.