FROM node:20

RUN npm install -g yarn --force
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE ${APP_PORT}

ENTRYPOINT ["yarn", "start"]
