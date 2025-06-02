FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

RUN mkdir -p /app/uploads && \
    chown -R node:node /app/uploads && \
    chmod -R 755 /app/uploads

CMD [ "nginx", "-g", "daemon off;" ]