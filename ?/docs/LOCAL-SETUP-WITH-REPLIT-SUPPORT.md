# Local Setup Guide with Replit AI Support

This guide explains how to set up your Satoshi Bean Mining platform on your personal computer while still having access to Replit AI's support and development assistance.

## Setting Up Your Local Environment

### Step 1: Export Your Project from Replit

1. In your Replit project, click on the three-dot menu in the top right
2. Select "Download as zip"
3. Save and extract the zip file to a location on your computer

### Step 2: Set Up Version Control

```bash
# Navigate to your extracted project folder
cd path/to/extracted/project

# Initialize a Git repository
git init

# Add all files to the repository
git add .

# Make your initial commit
git commit -m "Initial commit from Replit export"
```

### Step 3: Install Local Development Environment

**For Windows:**
1. Install Node.js 18.x from [nodejs.org](https://nodejs.org/)
2. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
3. Install Git from [git-scm.com](https://git-scm.com/download/win)

**For Mac:**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and PostgreSQL
brew install node@18 postgresql git
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql git
```

### Step 4: Set Up the Database

```bash
# Create a new PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER satoshibean WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE satoshibeandb OWNER satoshibean;"
```

### Step 5: Configure Environment Variables

Create a `.env` file in your project root with the following content:

```
DATABASE_URL=postgresql://satoshibean:your_secure_password@localhost:5432/satoshibeandb
PORT=3000
SESSION_SECRET=your_random_secure_session_secret
WALLET_ADDRESS=your_bitcoin_wallet_address
ADMIN_PASSWORD=admin123
```

### Step 6: Install Dependencies and Run

```bash
# Install dependencies
npm install

# Apply database migrations
npm run db:push

# Run the development server
npm run dev
```

Your application should now be running at http://localhost:3000

## Keeping Replit AI Support

To continue getting help from Replit AI while working on your local setup, you have several options:

### Option 1: GitHub Integration with Replit

1. Create a new repository on GitHub:
   ```bash
   # In your local project folder
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

2. Connect your GitHub repository to a new Replit project:
   - Open Replit and create a new project
   - Choose "Import from GitHub"
   - Select your repository
   - Replit AI will have access to your latest code

3. Sync changes regularly:
   ```bash
   # After making local changes
   git add .
   git commit -m "Describe your changes"
   git push
   ```

4. In your Replit project, pull the latest changes:
   ```bash
   git pull
   ```

### Option 2: Temporary Replit Projects for Help

1. When you need help, create a new Replit project with just the relevant files
2. Explain the issue to Replit AI
3. Apply the solutions to your local setup

### Option 3: Share Code Snippets with Replit AI

When facing specific issues:
1. Create a new Replit project
2. Copy only the relevant files/code from your local setup
3. Ask Replit AI for help with the specific problem

## Preparing for Production Deployment

When you're ready to move from local development to production:

1. Follow the detailed instructions in `SELF-HOSTING-GUIDE.md` for setting up a production environment
2. Consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "satoshibean" -- run start
   ```

3. Set up automated backups for your database:
   ```bash
   # Create a backup script
   echo "pg_dump -U satoshibean satoshibeandb > /path/to/backups/satoshibeandb_\$(date +%Y-%m-%d).sql" > backup.sh
   chmod +x backup.sh
   
   # Add to crontab to run daily
   (crontab -l 2>/dev/null; echo "0 0 * * * /path/to/backup.sh") | crontab -
   ```

## Troubleshooting Common Local Development Issues

### Database Connection Problems
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Restart PostgreSQL if needed
sudo systemctl restart postgresql
```

### Node.js Version Issues
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Install and use Node.js 18.x
nvm install 18
nvm use 18
```

### Port Conflicts
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Change the port in your .env file if needed
echo "PORT=3001" >> .env
```

### Git Sync Issues
```bash
# If you encounter merge conflicts
git fetch origin
git merge origin/main --strategy-option ours
```

## Android APK Integration

To adapt a template APK to work with your local or self-hosted setup:

1. Update the WebView URL to point to your computer's IP address or domain
2. Make sure your computer's firewall allows incoming connections on your app's port
3. For testing, connect both your device and computer to the same WiFi network

Remember to update the connection URL when moving from local development to production:

```java
// During local development
webView.loadUrl("http://192.168.1.100:3000");

// For production
webView.loadUrl("https://your-domain.com");
```

## Getting Help

If you encounter issues while working with your local setup:

1. Check error logs in the console where you're running the app
2. For database issues, connect to PostgreSQL and check tables:
   ```bash
   psql -U satoshibean -d satoshibeandb
   \dt  # List tables
   ```
3. Share specific error messages and relevant code when asking for help
4. Remember to push your changes to GitHub before asking for help in Replit

By following this guide, you can develop locally on your own computer while still keeping access to Replit AI's assistance when needed.