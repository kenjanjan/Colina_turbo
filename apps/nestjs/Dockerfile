# Use an official Node.js runtime as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Rebuild bcrypt to fix the binary issue
RUN npm rebuild bcrypt --build-from-source

# Build the Next.js application using Turborepo
RUN npx turbo run build

# Expose the port that your NestJS app listens on
EXPOSE 3000

# Start the NestJS app
CMD ["npm", "run", "start"]
