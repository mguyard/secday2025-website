const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des variables d'environnement
const START_SPECIAL_DATE = process.env.START_SPECIAL_DATE || '2025-07-01T14:30:00+02:00';
const END_SPECIAL_DATE = process.env.END_SPECIAL_DATE || '2025-07-01T17:30:00+02:00';
const COOKIE_NAME = 'security_day_visitor_id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 an en millisecondes
const START_VISITOR_COUNT = parseInt(process.env.START_VISITEUR) || 0; // Correction du nom de la variable

// Middleware pour parser les cookies
app.use(cookieParser());

// Initialisation de la base de données en mémoire
const db = new Database(':memory:');

// Création de la table pour stocker les visiteurs
db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    visitor_id TEXT PRIMARY KEY,
    timestamp TEXT
  )
`);

// Préparation des requêtes
const insertVisitor = db.prepare('INSERT OR IGNORE INTO visitors (visitor_id, timestamp) VALUES (?, ?)');
const countVisitors = db.prepare('SELECT COUNT(*) as count FROM visitors');

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour gérer le cookie visiteur
app.use((req, res, next) => {
  // Vérifier si le visiteur a déjà un cookie
  if (!req.cookies[COOKIE_NAME]) {
    // Créer un ID unique pour le visiteur
    const visitorId = uuidv4();
    
    // Définir le cookie avec paramètres optimisés pour reverse proxy et HTTPS
    res.cookie(COOKIE_NAME, visitorId, { 
      maxAge: COOKIE_MAX_AGE, 
      httpOnly: true,
      sameSite: 'lax',  // Plus permissif que 'strict' mais toujours sécurisé
      secure: true      // Important pour HTTPS - assure que le cookie n'est envoyé qu'en HTTPS
    });
    
    // Enregistrer le nouveau visiteur
    try {
      insertVisitor.run(visitorId, new Date().toISOString());
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du visiteur:', error);
    }
  }
  next();
});

// Route principale
app.get('/', (req, res) => {
  // Envoi de la page
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint pour récupérer les données
app.get('/api/stats', (req, res) => {
  // Comptage des visiteurs uniques 
  const visitorCount = countVisitors.get().count;
  
  // Vérification si la date actuelle est dans la plage spéciale
  const now = moment();
  const start = moment(START_SPECIAL_DATE);
  const end = moment(END_SPECIAL_DATE);
  
  // Détermination si nous sommes dans la période spéciale
  const isSpecialPeriod = now.isBetween(start, end);
  
  // Détermination du message à afficher
  let message = "🎾 Après un ultime SMASH, le site a tiré sa révérence, mais Fortinet n'est jamais hors-jeu !\n\nPour toute question sur les présentations, notre équipe assure le service continu. N'hésitez pas à nous contacter, on ne fait jamais de break pour nos clients !";
  if (isSpecialPeriod) {
    message = "🎾 Le juge de chaise demande le silence… et votre attention sur la présentation ! Cette page est hors-jeu, le vrai match est sous vos yeux.";
  }
  
  // Envoi des données au format JSON avec ajout du nombre de départ
  res.json({
    visitorCount: Math.max(1, visitorCount + START_VISITOR_COUNT),
    message,
    isSpecialPeriod
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
