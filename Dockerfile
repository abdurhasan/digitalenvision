FROM node:12

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

COPY . .

RUN npm install

RUN npm run build


CMD [ "npm", "start" ]
