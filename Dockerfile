FROM node:20.10-bullseye-slim

ENV NODE_ENV=production
WORKDIR /app
RUN npm i -g pnpm
COPY . .

RUN pnpm install


CMD pnpm start

