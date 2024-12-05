FROM node:18-alpine
LABEL authors="tai.tranhuu2002@gmail.com"

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]