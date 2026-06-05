FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
