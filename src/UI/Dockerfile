# Use Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for Expo
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . ./

# Expose Expo ports
# 19000: Expo Dev Server
# 19001: Expo Dev Tools
# 19002: Expo Metro Bundler
# 8081: Metro Bundler (alternative)
EXPOSE 19000 19001 19002 8081

# Start development server
CMD ["npm", "start"]
