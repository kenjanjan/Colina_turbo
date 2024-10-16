# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app
ENV NEXT_PUBLIC_API_URL=https://colinabe.azurewebsites.net/
ENV NEXT_PUBLIC_REMEMBER_TIME='30d'


# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js is running on
EXPOSE 3000

# Set the command to run the Next.js application
CMD ["npm", "start"]