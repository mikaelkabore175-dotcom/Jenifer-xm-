// utils/permissions.js

/**
 * Vérifie si un utilisateur est administrateur d’un groupe WhatsApp
 * @param {import('@whiskeysockets/baileys').default} sock - L’instance Baileys
 * @param {string} jid - Identifiant du groupe WhatsApp (ex: "12345-67890@g.us")
 * @param {string} userId - Identifiant complet de l’utilisateur (ex: "123456789@s.whatsapp.net")
 * @returns {Promise<boolean>} true si admin, sinon false
 */
async function isAdmin(sock, jid, userId) {
  if (!jid?.endsWith('@g.us')) return false;
  try {
    const metadata = await sock.groupMetadata(jid);
    const admins = metadata.participants
      .filter(p => p.admin !== null)  // admin ou superadmin non null
      .map(p => p.id);
    return admins.includes(userId);
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error);
    return false;
  }
}

module.exports = {
  isAdmin,
};
