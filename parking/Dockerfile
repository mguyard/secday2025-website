FROM node:18-alpine

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Créer le dossier public vide comme point de montage
RUN mkdir -p public

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande de démarrage
CMD ["node", "index.js"]
