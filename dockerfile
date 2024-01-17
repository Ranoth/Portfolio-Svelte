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

# FROM over/bun as base
# WORKDIR /app

# FROM base as install

# COPY . .

# RUN bun install

# RUN --mount=type=secret,id=ENVFILE \
#     export $( xargs < /run/secrets/ENVFILE ) && \
#     bun run build

# FROM base as builder
# WORKDIR /app

# RUN rm -rf ./*
# COPY --from=builder /app/build .

# RUN --mount=type=secret,id=ENVFILE \
#     export $( xargs < /run/secrets/ENVFILE )

# EXPOSE 3000

# ENTRYPOINT ["bun", "index.js"]

# ------------------------------

FROM oven/bun AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN --mount=type=secret,id=ENVFILE \
    export $( xargs < /run/secrets/ENVFILE ) && \
    bun run build

FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /app/build .
COPY --from=prerelease /app/package.json .

ENV ORIGIN=https://leobuhot.com

EXPOSE 3000
ENTRYPOINT ["bun", "run", "index.js"]
