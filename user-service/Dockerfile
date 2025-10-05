# ------------------------
# Stage 1: Builder
# ------------------------
# Use a specific, stable version of Node.js for consistency
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install ALL dependencies, including devDependencies, which are needed for Babel
RUN npm ci

# Copy all application source code
COPY . .

# Run the build. The output will be in /app/dist/bin/app.js
RUN npm run build


# ------------------------
# Stage 2: Production Image
# ------------------------
# Use a slimmed-down base image for a smaller final image size
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the compiled files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Expose the port your Express app listens on
EXPOSE 8051

# Run the application, specifying the correct entry point
# Correctly points to the transpiled file inside the bin directory
CMD ["node", "dist/bin/app.js"]