FROM oven/bun as builder
WORKDIR /app

COPY . .
RUN bun install

RUN --mount=type=secret,id=ENVFILE \
    export $( xargs < /run/secrets/ENVFILE ) && \
    bun run build

FROM oven/bun
WORKDIR /app

RUN rm -rf ./*
COPY --from=builder /app/package.json .
COPY --from=builder /app/build .

RUN bun install

EXPOSE 3000

ENTRYPOINT ["bun", "./build"]