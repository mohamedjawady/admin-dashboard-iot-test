# Use the official Node.js image for the build stage
FROM node:17-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use the official Nginx image for the final stage
FROM nginx:1.19.0

# Set the working directory to Nginx's web root
WORKDIR /usr/share/nginx/html

# Remove the default contents of the web root
RUN rm -rf ./*

# Copy the built artifacts from the builder stage to the web root
COPY --from=builder /app/build .

# The default command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
