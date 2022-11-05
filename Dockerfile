FROM node:14.17.0-alpine AS build
ARG WORK_DIR=/var/www/node
WORKDIR ${WORK_DIR}
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build