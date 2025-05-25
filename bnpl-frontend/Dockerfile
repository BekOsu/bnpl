# ----------------------
# 1. Build Stage
# ----------------------
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# ----------------------
# 2. Production Stage (Nginx)
# ----------------------
FROM nginx:stable-alpine

# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
