FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN apk add --no-cache openssl libc6-compat netcat-openbsd
RUN npm install

# Linting et formatage (optionnel pour CI/CD)
# RUN npm run lint && npm run format

# Copie du code source
COPY . .

# Génération du client Prisma (nécessaire pour Alpine)
RUN npx prisma generate

# Exposition du port Next.js
EXPOSE 3000

# Variable d'environnement Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://postgres:password@db:5432/crazy_charly?schema=public

# Script d'initialisation
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Utilisation de l'entrypoint pour migrer/seed
ENTRYPOINT ["entrypoint.sh"]

# Démarrage en mode développement
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
