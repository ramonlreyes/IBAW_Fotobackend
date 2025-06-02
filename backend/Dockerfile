FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

ENV PORT=5000

EXPOSE 5000

USER node

CMD ["node", "server.js"]

