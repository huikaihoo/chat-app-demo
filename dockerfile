FROM node:20.11-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY app.js ./
COPY public ./public

CMD ["yarn", "start"]
