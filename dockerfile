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
    --mount=type=secret,id=PUBLIC_GITHUB_USERNAME,required=false \
    --mount=type=secret,id=PUBLIC_GITHUB_API_URL,required=false \
    --mount=type=secret,id=PUBLIC_RECAPTCHA_SITE_KEY,required=false \
    if [ -f /run/secrets/ENVFILE ]; then \
        cat /run/secrets/ENVFILE > .env; \
    fi && \
    if [ -f /run/secrets/PUBLIC_GITHUB_USERNAME ]; then \
        echo "PUBLIC_GITHUB_USERNAME=$(cat /run/secrets/PUBLIC_GITHUB_USERNAME)" >> .env; \
    fi && \
    if [ -f /run/secrets/PUBLIC_GITHUB_API_URL ]; then \
        echo "PUBLIC_GITHUB_API_URL=$(cat /run/secrets/PUBLIC_GITHUB_API_URL)" >> .env; \
    fi && \
    if [ -f /run/secrets/PUBLIC_RECAPTCHA_SITE_KEY ]; then \
        echo "PUBLIC_RECAPTCHA_SITE_KEY=$(cat /run/secrets/PUBLIC_RECAPTCHA_SITE_KEY)" >> .env; \
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