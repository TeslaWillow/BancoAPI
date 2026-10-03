# ./frontend_angular/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

# 1. Fix permission error for npm i -g
RUN npm config set unsafe-perm true

# 2. Upgrade npm
RUN npm install -g npm@11.6.2

# 3. Copy and install dependencies (with proper caching)
COPY package*.json ./
RUN npm ci

# 4. Copy the rest of the source code
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/frontend_angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]