# Gunakan base image Node.js
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file source
COPY . .

# Expose port internal (misal 8051)
EXPOSE 8051

# Jalankan aplikasi
CMD ["npm", "start"]
