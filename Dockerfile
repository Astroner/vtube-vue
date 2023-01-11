FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ARG API_ADDRESS
ENV PORT=3000
ENV VUE_APP_MAIN_API=$API_ADDRESS
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]