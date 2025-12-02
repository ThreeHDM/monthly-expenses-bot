# Use Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the application files
COPY bot.js processExpense.js googleClient.js ./
COPY keys.json ./

# Start the Discord bot
CMD ["npm", "start"]
