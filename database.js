//database.js
const fs = require('fs');
const path = require('path');

const dbFilePath = path.resolve(__dirname, 'database.json');

let database = {};

// Charger les données si le fichier existe
function loadDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const rawData = fs.readFileSync(dbFilePath, 'utf-8');
      database = JSON.parse(rawData);
      console.log('📚 Base de données chargée.');
    } else {
      database = {};
    }
  } catch (error) {
    console.error('Erreur chargement base de données:', error);
    database = {};
  }
}

// Sauvegarder les données dans le fichier
function saveDatabase() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(database, null, 2));
    console.log('💾 Base de données sauvegardée.');
  } catch (error) {
    console.error('Erreur sauvegarde base de données:', error);
  }
}

// Récupérer une donnée par clé (ex: "users", "warnings", "settings")
function getData(key) {
  return database[key] || null;
}

// Modifier/ajouter une donnée
function setData(key, value) {
  database[key] = value;
  saveDatabase();
}

// Ajouter ou modifier une entrée dans un objet stocké (ex: utilisateur, membre)
function updateEntry(key, id, newData) {
  const obj = database[key] || {};
  obj[id] = { ...obj[id], ...newData };
  database[key] = obj;
  saveDatabase();
}

loadDatabase();

module.exports = {
  getData,
  setData,
  updateEntry,
  loadDatabase,
  saveDatabase,
};