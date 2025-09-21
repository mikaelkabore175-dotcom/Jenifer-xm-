// utils/databaseHelpers.js

const db = require('../database');

/**
 * Récupère les warnings d'un utilisateur donné
 * @param {string} userId Id complet utilisateur (ex: "123456789@s.whatsapp.net")
 * @returns {object|null} warning object ou null si non trouvé
 */
function getUserWarnings(userId) {
  const warnings = db.getData('warnings') || {};
  return warnings[userId] || null;
}

/**
 * Ajoute un warning à un utilisateur ou crée une entrée
 * @param {string} userId 
 * @param {object} newWarning 
 */
function addUserWarning(userId, newWarning) {
  const warnings = db.getData('warnings') || {};
  warnings[userId] = { ...warnings[userId], ...newWarning };
  db.setData('warnings', warnings);
}

/**
 * Supprime les warnings d'un utilisateur
 * @param {string} userId 
 */
function clearUserWarnings(userId) {
  const warnings = db.getData('warnings') || {};
  if (warnings[userId]) {
    delete warnings[userId];
    db.setData('warnings', warnings);
  }
}

module.exports = {
  getUserWarnings,
  addUserWarning,
  clearUserWarnings,
};
