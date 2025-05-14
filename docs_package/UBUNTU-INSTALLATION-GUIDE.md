# Ubuntu Installation Guide for Satoshi Bean Mining Platform

This guide will walk you through installing and setting up the Satoshi Bean Mining Platform on your Ubuntu system.

## System Requirements
- Ubuntu 20.04 LTS or newer
- Node.js 16+ and npm
- At least 2GB of RAM (your system has 3.8GB which is sufficient)
- At least 1GB of free disk space (your system has 194GB free which is more than enough)

## Installation Steps

### 1. Create Installation Directory

```bash
# Create a directory for the application
mkdir -p ~/satoshi-bean-mining
cd ~/satoshi-bean-mining
```

### 2. Install Required Dependencies

```bash
# Update package lists
sudo apt update

# Install Node.js and npm if not already installed
sudo apt install -y curl build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show 8.x.x or higher

# Install required system dependencies
sudo apt install -y git
```

### 3. Download the Application

There are two ways to get the application:

#### Option A: Download ZIP from Replit (Recommended)
1. In Replit, download the project as a ZIP file by clicking the three dots menu near the top right
2. Transfer the ZIP file to your Ubuntu machine
3. Extract the ZIP file to the satoshi-bean-mining directory
```bash
# After transferring the ZIP file to your Ubuntu machine
unzip satoshi-bean-mining.zip -d ~/satoshi-bean-mining
cd ~/satoshi-bean-mining
```

#### Option B: Use Git Clone (Alternative)
```bash
# If you prefer using Git directly
git clone <repository-url> ~/satoshi-bean-mining
cd ~/satoshi-bean-mining
```

### 4. Install Node.js Dependencies

```bash
# Install project dependencies
npm install
```

### 5. Set Up Database

The application uses PostgreSQL for data storage. You'll need to set up a database:

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER mininguser WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "CREATE DATABASE miningdb OWNER mininguser;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE miningdb TO mininguser;"
```

### 6. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Create and edit .env file
nano .env
```

Add the following content to the `.env` file:

```
# Database Configuration
DATABASE_URL=postgresql://mininguser:secure_password@localhost:5432/miningdb

# Application Settings
PORT=5000
NODE_ENV=production

# Admin Account (Change these values for security)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Bitcoin Wallet Settings
ADMIN_WALLET_ADDRESS=bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps

# Optional: Email settings (for verification emails, if needed)
# SENDGRID_API_KEY=your_sendgrid_api_key
```

Save and exit (Ctrl+X, then Y, then Enter).

### 7. Run Database Migrations

```bash
# Run database migrations to set up tables
npm run db:push
```

### 8. Start the Application

```bash
# Build the application
npm run build

# Start the application
npm start
```

The application should now be running on http://localhost:5000

### 9. Create a Systemd Service (Optional)

To run the application as a service that starts automatically:

```bash
# Create systemd service file
sudo nano /etc/systemd/system/satoshi-mining.service
```

Add the following content:

```
[Unit]
Description=Satoshi Bean Mining Platform
After=network.target postgresql.service

[Service]
Type=simple
User=mo
WorkingDirectory=/home/mo/satoshi-bean-mining
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

Save and exit (Ctrl+X, then Y, then Enter).

Enable and start the service:

```bash
sudo systemctl enable satoshi-mining
sudo systemctl start satoshi-mining
sudo systemctl status satoshi-mining  # Check if it's running correctly
```

## Accessing the Application

- Main interface: http://localhost:5000
- Admin login: Use the credentials specified in your .env file (default: admin/admin123)

## Using Ghost User Functionality

After logging in as admin, you can:

1. Navigate to the Admin Dashboard
2. Access the "Ghost Users" tab
3. Create and manage ghost mining accounts
4. Control ghost user simulation for demonstrating mining activity

## Troubleshooting

If you encounter any issues:

1. Check logs with: `sudo journalctl -u satoshi-mining.service`
2. Verify database connection: `psql -h localhost -U mininguser -d miningdb`
3. Ensure all dependencies are installed: `npm install`
4. Check for firewall issues: `sudo ufw status`

## Security Considerations

For a production environment:
1. Change the default admin credentials
2. Secure your PostgreSQL installation
3. Configure a proper firewall
4. Set up SSL/TLS for secure connections

## Support

If you need further assistance, please refer to the documentation or contact support.