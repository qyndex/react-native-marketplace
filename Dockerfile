FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx expo export --platform web --output-dir dist
# Expo's emitted JS uses `import.meta`, which requires the script tag to be type="module".
RUN sed -i 's|<script src=\("/_expo/static/js/web/[^"]*"\) defer></script>|<script type="module" src=\1></script>|g' dist/index.html

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
