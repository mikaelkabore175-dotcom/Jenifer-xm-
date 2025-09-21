// utils/format.js

/**
 * Formate une date en chaîne lisible locale
 * @param {Date|string|number} d Date objet ou string/number convertible en date
 * @returns {string} date formatée (ex: "20/09/2025 16:53")
 */
function formatDateTime(d) {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Met en forme un nombre en format « 1,234 » avec séparateur de milliers
 * @param {number} number un nombre
 * @returns {string} nombre formaté
 */
function formatNumber(number) {
  return number.toLocaleString();
}

/**
 * Coupe un texte à une longueur max et ajoute "..." si coupé
 * @param {string} text texte original
 * @param {number} maxLength longueur max
 * @returns {string} texte coupé proprement
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

module.exports = {
  formatDateTime,
  formatNumber,
  truncateText,
};
