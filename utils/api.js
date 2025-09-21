// utils/api.js
const axios = require('axios');

/**
 * Télécharge un JSON depuis une URL avec gestion d'erreur
 * @param {string} url URL de l'API
 * @param {object} options options axios (headers, params, ...)
 * @returns {Promise<object|null>} donnée JSON ou null en cas d'erreur
 */
async function fetchJson(url, options = {}) {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error('Erreur API fetchJson:', error.message || error);
    return null;
  }
}

/**
 * Télécharge un média (image, vidéo) depuis URL
 * @param {string} url URL du média
 * @param {object} options options axios (headers, responseType, ...)
 * @returns {Promise<Buffer|null>} buffer contenant le média ou null en cas d'erreur
 */
async function fetchMedia(url, options = {}) {
  try {
    const response = await axios.get(url, { ...options, responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Erreur API fetchMedia:', error.message || error);
    return null;
  }
}

module.exports = {
  fetchJson,
  fetchMedia,
};
