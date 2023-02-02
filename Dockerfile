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
ENV DOMAIN=
ENV REFERER_EMPTY=true

RUN addgroup -g ${GID} --system meting \
    && adduser -G meting --system -D -s /bin/sh -u ${UID} meting

COPY --from=0 /app/dist/cloudflare-workers.js /app/dist/cloudflare-workers.js
RUN deno cache /app/dist/cloudflare-workers.js

RUN chown -R meting:meting /app
USER meting

EXPOSE ${PORT}

CMD deno run --allow-net --allow-env /app/dist/cloudflare-workers.js --PORT=${PORT} --ORIGIN=${ORIGIN} --DOMAIN=${DOMAIN} --REFERER_EMPTY=${REFERER_EMPTY}
