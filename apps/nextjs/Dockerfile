# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app


# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build
#10 45.61 undefined rememberMeTime2 
#10 45.61 null rememberme
#10 45.61 email 
#10 45.61 true isAccessed
#10 45.61 false isForgotPassword
#10 45.61 
   Generating static pages (9/12) 
#10 45.74 
 ✓ Generating static pages (12/12) 
#10 45.75 
#10 45.75 > Export encountered errors on following paths:
#10 45.75 	/(routes)/appointments/page: /appointments
#10 45.75 	/(routes)/chart/page: /chart
#10 45.75 	/(routes)/dashboard/page: /dashboard
#10 45.75 	/(routes)/due-medications/page: /due-medications
#10 45.75 	/(routes)/notifications/page: /notifications
#10 45.75 	/(routes)/patient-list/page: /patient-list
#10 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [6/6] RUN npm run build:
45.61 
   Generating static pages (9/12) 
45.74 
 ✓ Generating static pages (12/12) 
45.75 
45.75 > Export encountered errors on following paths:
45.75 	/(routes)/appointments/page: /appointments
45.75 	/(routes)/chart/page: /chart
45.75 	/(routes)/dashboard/page: /dashboard
45.75 	/(routes)/due-medications/page: /due-medications
45.75 	/(routes)/notifications/page: /notifications
45.75 	/(routes)/patient-list/page: /patient-list
------
Dockerfile:18
--------------------
  16 |     
  17 |     # Build the Next.js application
  18 | >>> RUN npm run build
  19 |     
  20 |     # Expose the port Next.js is running on
--------------------
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
Error: Process completed with exit code 1.

# Expose the port Next.js is running on
EXPOSE 3001

# Set the command to run the Next.js application
CMD ["npm", "start"]