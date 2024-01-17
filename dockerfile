# FROM oven/bun

# WORKDIR /app
# COPY package.json package.json
# RUN bun install

# COPY . .

# RUN --mount=type=secret,id=ENVFILE \
#     export $( xargs < /run/secrets/ENVFILE ) && \
#     bun run build

# EXPOSE 3000
# ENTRYPOINT ["bun", "./build"]

# ------------------------------

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
COPY --from=builder /app/build .

EXPOSE 3000

ENTRYPOINT ["bun", "index.js"]