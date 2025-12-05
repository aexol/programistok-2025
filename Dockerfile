ARG NODE_VER=24

# 1. Install dependencies only when needed
ARG docker_io_image_prefix=docker.io/library
FROM ${docker_io_image_prefix}/node:$NODE_VER-alpine AS deps
WORKDIR /home/node

# Install dependencies based on npm
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci

# 1. Install dependencies only when needed
FROM deps as builder

COPY . .
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm run build

# 3. Production image, copy all the files and run next
FROM ${docker_io_image_prefix}/node:$NODE_VER-alpine
ENV NODE_ENV=production

# COPY --from=builder --chown=node:node /home/node/packages/panel/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=node:node /home/node/packages/panel/.next/static ./packages/panel/.next/static

WORKDIR /home/node

COPY --from=builder --chown=node:node . .
RUN npm i -g serve

EXPOSE 3000
ENV PORT=3000
CMD [ "serve", "-s", "home/node/dist" ]
