# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install build-essential for building native modules
RUN apt-get update && apt-get install -y build-essential sqlite3

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app is running on
EXPOSE 3000

# Rebuild the sqlite3 module
RUN npm rebuild

# Command to run your application
CMD ["npm", "start"]
