FROM node:20-slim

WORKDIR /app

# Install tsx globally
RUN npm install -g tsx

# Copy package.json and install dependencies
COPY --chown=node:node package.json tsconfig.json ./
RUN npm install

# Copy source code
COPY --chown=node:node src/ ./src/

# Create a non-root user (node image come with 'node' user)
# We use the default 'node' user for security
USER node

CMD ["tsx", "src/index.ts"]