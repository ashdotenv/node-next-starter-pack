FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN if [ -f tsconfig.json ]; then npm run build; fi

EXPOSE 3000

CMD ["node", "dist/server.js"]
