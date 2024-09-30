FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript

RUN next build

COPY . .

EXPOSE 3000/tcp

CMD ["next start"]
