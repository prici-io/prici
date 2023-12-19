FROM node:20.10-bullseye-slim

WORKDIR /app
RUN npm i -g pnpm
COPY . .

RUN pnpm install

CMD pnpm start

