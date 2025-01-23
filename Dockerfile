# Use Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose the port (if your bot listens to a webhook)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
