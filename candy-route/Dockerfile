FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production CANDY_ARENA_HOST=0.0.0.0
COPY package.json arena-server.mjs adventure-rules.js studio-rules.js game.js ./
EXPOSE 3377
USER node
CMD ["node", "arena-server.mjs"]
