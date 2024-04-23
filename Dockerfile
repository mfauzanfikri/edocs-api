FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate


COPY . .

RUN npm run build

EXPOSE 3010

CMD [ "npm", "run","start:migrate:prod" ]