FROM node:20-alpine
WORKDIR /chatto
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD yarn dev
