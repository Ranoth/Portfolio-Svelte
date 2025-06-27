FROM node:lts-alpine AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev /temp/prod

COPY package.json package-lock.json /temp/dev/
WORKDIR /temp/dev
RUN npm ci

COPY package.json package-lock.json /temp/prod/
WORKDIR /temp/prod
RUN npm ci --omit=dev

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN --mount=type=secret,id=ENVFILE,required=false \
    if [ -f /run/secrets/ENVFILE ]; then \
    source /run/secrets/ENVFILE; \
    elif [ -f .env ]; then \
    source .env; \
    fi && \
    npm run build

FROM node:lts-alpine AS release
WORKDIR /app
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/build .
COPY --from=prerelease /app/package.json .

ENV NODE_ENV=production
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]