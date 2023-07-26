FROM node:alpine3.18 as builder
WORKDIR /app

COPY . .
RUN npm install

SHELL ["/bin/bash", "-c"]

RUN --mount=type=secret,id=ENVFILE \
    export /run/secrets/ENVFILE | xargs && \
    npm run build

FROM node:alpine3.18
WORKDIR /app
RUN rm -rf ./*
COPY --from=builder /app/package.json .
COPY --from=builder /app/build .

RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
