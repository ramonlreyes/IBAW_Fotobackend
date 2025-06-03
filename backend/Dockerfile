FROM node:20-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .


RUN mkdir -p uploads && \
    chown -R node:node uploads && \
    chmod -R 755 uploads


ENV PORT=5000
ENV NODE_ENV=development


EXPOSE 5000

USER node

CMD ["node", "server.js"]