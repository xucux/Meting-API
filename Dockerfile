FROM node:18-alpine as builder

WORKDIR /app
COPY . /app

RUN npm i && npm run build:all

FROM denoland/deno:alpine-1.30.0 as prod

ARG UID
ARG GID

ENV UID=${UID:-1010}
ENV GID=${GID:-1010}
ENV PORT=3000
ENV ORIGIN=*
ENV DOMAIN=localhost
ENV REFERER_EMPTY=true
ENV REFERER_CHECK=
ENV HELLO_WORLD="🎊你好，这是Meting-API🚀 自行部署请参考 https://github.com/xizeyoupan/Meting-API"

RUN addgroup -g ${GID} --system meting \
    && adduser -G meting --system -D -s /bin/sh -u ${UID} meting

COPY --from=0 /app/dist/deno.js /app/dist/deno.js
RUN deno cache /app/dist/deno.js

RUN chown -R meting:meting /app
USER meting

EXPOSE ${PORT}

CMD deno run --allow-net --allow-env /app/dist/deno.js --PORT=${PORT} --ORIGIN=${ORIGIN} --DOMAIN=${DOMAIN} --REFERER_EMPTY=${REFERER_EMPTY} --REFERER_CHECK=${REFERER_CHECK} --HELLO_WORLD=${HELLO_WORLD}
