FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY public/ .
COPY index.html .
COPY server.js .

RUN npm install

CMD ["npm", "start"]