FROM node:17-alpine as build-image
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm i
RUN npx tsc

FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/dist ./dist
RUN npm i --production
COPY . .
EXPOSE 8080
EXPOSE 9229
CMD [ "node", "dist/index.js" ]
