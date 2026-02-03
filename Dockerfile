# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
RUN apk add curl
RUN npm install -g serve
COPY --from=builder /app/build build
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
CMD ["serve","-s","build","-l","3000"]
