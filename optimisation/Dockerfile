FROM node:20-slim

WORKDIR /app

RUN npm config set strict-ssl false

COPY --chown=node:node package.json tsconfig.json ./

RUN npm install

COPY --chown=node:node src/ ./src/

USER node

CMD ["npx", "tsx", "src/index.ts"]