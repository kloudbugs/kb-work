# TERA Mining Platform - Umbrel Docker Image
FROM node:18-alpine

# Install system dependencies for mining
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    git \
    curl \
    wget \
    bash

# Install Python mining dependencies
RUN pip3 install requests colorama

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create directories for miners and logs
RUN mkdir -p /app/miners /app/miners/logs /app/data

# Expose the application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/mining/stats/realtime || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=file:/app/data/database.db

# Start the application
CMD ["npm", "start"]