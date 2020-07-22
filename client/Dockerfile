FROM node:12.18.2-alpine3.12
# FROM node:14.5.0-stretch

WORKDIR /app

COPY package.json .
RUN npm install --only=prod

COPY . .

CMD ["npm", "run", "dev"]