FROM node:22-bookworm-slim
WORKDIR /app
COPY . .
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4180 PRO4X4_DB=/data/rigbuilder.sqlite
RUN mkdir -p /data && chown -R node:node /app /data
USER node
VOLUME ["/data"]
EXPOSE 4180
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:4180/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","server/server.js"]
