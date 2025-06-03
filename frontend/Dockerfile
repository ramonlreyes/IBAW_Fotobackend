FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


RUN mkdir -p /app/uploads && \
    chown -R nginx:nginx /app/uploads && \
    chmod -R 755 /app/uploads


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]