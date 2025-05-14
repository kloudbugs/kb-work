# KLOUD-BUGS-MINING-CAFE Private Installation Guide

This guide will walk you through setting up your KLOUD-BUGS-MINING-CAFE platform in a private environment on Ubuntu, without using GitHub or any public repositories.

## Step 1: Prepare Ubuntu Environment

1. **Install Ubuntu Server** (recommended for privacy and performance)
   ```bash
   # If you're starting from scratch, download Ubuntu Server 22.04 LTS from:
   # https://ubuntu.com/download/server
   
   # Create a bootable USB with the ISO file using Rufus, Etcher, or another tool
   # Boot from the USB and follow the installation prompts
   ```

2. **Update System Packages**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. **Install Required System Dependencies**
   ```bash
   sudo apt install -y build-essential curl wget git unzip
   sudo apt install -y libssl-dev libreadline-dev zlib1g-dev
   ```

4. **Set Up Firewall (UFW)**
   ```bash
   sudo apt install -y ufw
   sudo ufw allow ssh
   sudo ufw enable
   ```

5. **Create Application User** (for additional security)
   ```bash
   sudo adduser kloudbugs
   sudo usermod -aG sudo kloudbugs
   
   # Switch to the new user
   su - kloudbugs
   ```

## Step 2: Download Project from Replit

1. In your Replit project, click the three dots (...) in the Files panel
2. Select "Download as zip"
3. Save the ZIP file to your computer

## Step 3: Transfer to Ubuntu Machine

1. Copy the ZIP file to your Ubuntu machine using a USB drive
2. Or use secure file transfer if your machines are connected:
   ```bash
   # Example using scp (run on your local machine):
   scp ~/Downloads/your-project.zip kloudbugs@your-ubuntu-ip:~/
   ```

## Step 4: Basic Setup on Ubuntu

```bash
# Create a project directory
mkdir -p ~/kloudbugs-mining
cd ~/kloudbugs-mining

# Extract the zip file (assuming it's in your home directory)
unzip ~/your-project.zip -d .

# Install Node.js and npm if not already installed
sudo apt update
sudo apt install -y nodejs npm

# Check versions
node --version
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 5: Database Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# In the PostgreSQL prompt, run:
CREATE DATABASE kloudbugs_db;
CREATE USER kloudbugs_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kloudbugs_db TO kloudbugs_user;
\q

# Create database tables (using your project's schema)
cd ~/kloudbugs-mining
npm run db:push
```

## Step 6: Environment Configuration

```bash
# Create .env file
cd ~/kloudbugs-mining
touch .env

# Edit the .env file
nano .env

# Add these lines:
DATABASE_URL=postgresql://kloudbugs_user:your_secure_password@localhost:5432/kloudbugs_db
NODE_ENV=development
PORT=3000
# Add any other required environment variables for Bitcoin services
```

## Step 7: Install Project Dependencies

```bash
# Install dependencies
cd ~/kloudbugs-mining
npm install
```

## Step 8: Run Application

```bash
# Start the application
cd ~/kloudbugs-mining
npm run dev

# Your app will be available at:
# http://localhost:3000
```

## Step 9: Security Measures

```bash
# Install UFW firewall if not already installed
sudo apt install -y ufw

# Allow SSH access (if needed)
sudo ufw allow ssh

# Only allow local network access to your app
sudo ufw allow from 192.168.0.0/24 to any port 3000

# Deny other external access
sudo ufw enable
```

## Step 10: Create Backup System

```bash
# Create a backup script
nano ~/backup-kloudbugs.sh

# Add this content:
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR=~/kloudbugs-backups
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U kloudbugs_user kloudbugs_db > $BACKUP_DIR/db-backup-$TIMESTAMP.sql

# Backup code files
tar -czf $BACKUP_DIR/code-backup-$TIMESTAMP.tar.gz -C ~/kloudbugs-mining .

echo "Backup completed: $TIMESTAMP"

# Make script executable
chmod +x ~/backup-kloudbugs.sh

# Run it manually whenever you want to create a backup
~/backup-kloudbugs.sh
```

## Step 11: SSH Remote Access Setup

For secure remote access to your Ubuntu server:

```bash
# Make sure SSH server is installed
sudo apt install -y openssh-server

# Start and enable SSH service
sudo systemctl start ssh
sudo systemctl enable ssh

# Secure SSH with key-based authentication (more secure than passwords)
# On your LOCAL machine (not the server), generate SSH keys if you don't have them:
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy your public key to the server (replace with your server's IP)
ssh-copy-id kloudbugs@your-server-ip

# On the SERVER, edit SSH config for better security
sudo nano /etc/ssh/sshd_config

# Make these security changes:
# - Disable password authentication
# - Disable root login
# Find and change these lines:
PasswordAuthentication no
PermitRootLogin no

# Restart SSH service
sudo systemctl restart ssh
```

To connect to your server remotely:
```bash
# From your local machine
ssh kloudbugs@your-server-ip

# For first-time connections, accept the fingerprint
# To tunnel the web application port to your local machine:
ssh -L 8080:localhost:3000 kloudbugs@your-server-ip
# This lets you access the app at http://localhost:8080 on your local machine
```

## Step 12: Testing Your Installation

1. Open a web browser on your Ubuntu machine
2. Navigate to http://localhost:3000
3. Verify you can see the login screen
4. Log in with your credentials

## Troubleshooting

If you encounter any issues:

1. Check the application logs:
```
cd ~/kloudbugs-mining
npm run logs
```

2. Check PostgreSQL is running:
```
sudo systemctl status postgresql
```

3. Check your firewall settings:
```
sudo ufw status
```

4. Verify environment variables:
```
cd ~/kloudbugs-mining
cat .env
```

## Important Notes

1. This setup provides complete privacy as requested
2. Your intellectual property remains entirely under your control
3. No code is exposed to public repositories
4. Authentication is handled by your app's built-in system
5. Real data is used in a controlled environment

Remember: The 401 unauthorized responses are intentional and part of your exclusivity model design.

## Related Documentation

For users who want to access this server from macOS:
- See the `MAC-SSH-REMOTE-ACCESS.md` file for detailed instructions