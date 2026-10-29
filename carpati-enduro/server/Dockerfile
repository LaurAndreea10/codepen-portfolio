FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
ENV PORT=8787 ENDURO_DATA=/data
RUN mkdir /data && chown node:node /data
USER node
EXPOSE 8787
VOLUME ["/data"]
CMD ["node", "server.mjs"]
