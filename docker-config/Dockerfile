# Stage 1: Build React app
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Serve with Nginx with conditional SSL
FROM nginx:1.27-alpine

# Build argument for environment mode
ARG ENV=development

# Install OpenSSL only for development environment
RUN if [ "$ENV" = "development" ]; then \
    apk add --no-cache openssl; \
  fi

# Generate self-signed SSL certificate for development environment
RUN if [ "$ENV" = "development" ]; then \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/key.pem \
      -out /etc/nginx/ssl/cert.pem \
      -subj "/C=KR/ST=Seoul/L=Seoul/O=Dev/CN=localhost"; \
  fi

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate for development environment
RUN if [ "$ENV_MODE" = "development" ]; then \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/key.pem \
      -out /etc/nginx/ssl/cert.pem \
      -subj "/C=KR/ST=Seoul/L=Seoul/O=Dev/CN=localhost"; \
  fi

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
