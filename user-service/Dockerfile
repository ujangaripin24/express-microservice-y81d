# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ------------------------
# Stage 2: Production Image
# ------------------------
FROM node:20-alpine

WORKDIR /app

# Copy the transpiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the non-compiled, runtime configuration files
COPY config ./config
# Copy other non-compiled, runtime folders if needed, like 'bin/'
# COPY bin ./bin 
# COPY models ./models

# Copy package.json and install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

EXPOSE 8051

CMD ["node", "dist/bin/app.js"]
