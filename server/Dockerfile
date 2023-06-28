FROM node:18-alpine
LABEL authors="tai.tranhuu2002@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

COPY . .

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start:dev"]