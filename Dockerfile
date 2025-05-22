FROM nginx:alpine

# Copier le fichier de configuration NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port HTTP
EXPOSE 80

# Le serveur NGINX démarre automatiquement quand le conteneur est lancé
