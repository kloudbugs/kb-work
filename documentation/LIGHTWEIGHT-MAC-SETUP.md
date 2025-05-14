# Lightweight Mac Setup for Satoshi Bean Mining

This ultra-simple guide helps you run your Satoshi Bean Mining platform on your older Mac with minimal software installation and system impact.

## Step 1: Download Your Project

1. In Replit, click the three dots (⋮) in the top-right corner
2. Select "Download as zip"
3. Save the file to your Mac's Downloads folder

## Step 2: Install Only What's Needed

Open Terminal (Applications → Utilities → Terminal) and run these commands:

```bash
# Install Homebrew (package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install only Node.js
brew install node

# Check if Node installed correctly
node --version
# Should show v16.x or higher
```

## Step 3: Set Up Your Project

```bash
# Create a folder for your project
mkdir -p ~/satoshi-app

# Unzip your download (adjust filename if needed)
unzip ~/Downloads/satoshi-bean.zip -d ~/satoshi-app

# Go to your project folder
cd ~/satoshi-app

# Install only the necessary dependencies
npm install express react react-dom

# Create a simple config file
cat > .env << EOL
PORT=3000
NODE_ENV=production
ADMIN_PASSWORD=admin123
WALLET_ADDRESS=bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps
DEMO_MODE=true
EOL
```

## Step 4: Run in Demo Mode

Since you want to keep it lightweight, you can run in demo mode without needing PostgreSQL:

```bash
# Edit package.json to add a simple start command
cat > start.js << EOL
// Simple starter script
require('./server/index.js');
EOL

# Start your application
node start.js
```

## Access Your Application

1. Open Safari or Chrome
2. Go to http://localhost:3000
3. Log in with username "admin" and password "admin123"

## Keep It Running (Optional)

To create a simple autostart:

1. Open System Preferences → Users & Groups
2. Click on Login Items
3. Click + and navigate to Applications → Utilities
4. Select Terminal and click Add
5. Create a startup file:

```bash
cat > ~/startup-mining.command << EOL
#!/bin/bash
cd ~/satoshi-app
node start.js
EOL

chmod +x ~/startup-mining.command
```

Now when you log in, Terminal will open and run your startup script.

## Keep Your Mac Awake

1. Open System Preferences → Energy Saver
2. Set "Computer sleep" to "Never"
3. Uncheck "Put hard disks to sleep when possible"

---

This lightweight setup runs your application with minimal impact on your Mac. Since it runs in demo mode, it doesn't require a database, making it much simpler to set up and run.

If you later decide you want the full features with database support, you can follow the more detailed 2017-INTEL-MAC-SETUP.md guide.