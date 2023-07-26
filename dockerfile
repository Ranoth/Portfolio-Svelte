FROM node:alpine3.18 as builder
WORKDIR /app

COPY . .
RUN npm install

# RUN --mount=type=secret,id=FORMSPREE_API_URL \
#     export FORMSPREE_API_URL=$( cat /run/secrets/FORMSPREE_API_URL ) && \
#     export PUBLIC_GITHUB_USERNAME=Ranoth && \
#     export PUBLIC_GITHUB_API_URL=https://api.github.com && \
#     npm run build

RUN --mount=type=secret, id=ENVFILE \
    while IFS = read -r line; do export "$line"; done < /run/secrets/ENVFILE && \
    npm run build

FROM node:alpine3.18
WORKDIR /app
RUN rm -rf ./*
COPY --from=builder /app/package.json .
COPY --from=builder /app/build .

RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]