FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]

