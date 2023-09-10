FROM oven/bun

WORKDIR /app
COPY package.json package.json
RUN bun install

COPY . .
RUN --mount=type=secret,id=ENVFILE \
    export $( xargs < /run/secrets/ENVFILE ) && \
    bun run build

EXPOSE 3000
ENTRYPOINT ["bun", "./build"]
