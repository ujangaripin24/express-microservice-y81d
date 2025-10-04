# ------------------------
# Stage 1: Build (pakai babel)
# ------------------------
# Gunakan base image Node.js
FROM node:20 AS builder

# set workdir
WORKDIR /app

# copy package.json dan install dependencies
COPY package*.json ./
RUN npm install --production=false

# copy semua source code
COPY . .

# build dengan babel (output ke dist/)
RUN npm run build


# ------------------------
# Stage 2: Production Image
# ------------------------
FROM node:20-alpine

WORKDIR /app

# hanya copy package.json & install deps production
COPY package*.json ./
RUN npm install --production

# copy hasil build dari stage builder
COPY --from=builder /app/dist ./dist

# expose port (misalnya 8051 untuk auth-service)
EXPOSE 8050

# jalankan hasil build
CMD ["node", "dist/app.js"]