//getpp.js
async function sendProfilePicture(sock, message) {
  try {
    const jid = message.key.remoteJid;

    // Vérifier si la commande est en réponse à un message
    if (
      !message.message.extendedTextMessage ||
      !message.message.extendedTextMessage.contextInfo ||
      !message.message.extendedTextMessage.contextInfo.participant
    ) {
      return await sock.sendMessage(jid, { text: "Merci de répondre à un message de la personne ciblée." });
    }

    // Obtenir le JID de la personne ciblée
    const targetJid = message.message.extendedTextMessage.contextInfo.participant;

    // Télécharger l'URL de la photo de profil (image HD)
    let ppUrl = null;
    try {
      ppUrl = await sock.profilePictureUrl(targetJid, 'image');
    } catch (err) {
      // Si pas de photo ou erreur, utiliser une image par défaut
      ppUrl = null;
    }

    if (!ppUrl) {
      return await sock.sendMessage(jid, { text: "Cette personne n'a pas de photo de profil disponible." });
    }

    // Envoyer la photo de profil avec légende et lien chaîne
    await sock.sendMessage(jid, {
      image: { url: ppUrl },
      caption: `[Lien vers ma chaîne] : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100`
    });
  } catch (error) {
    console.error('Erreur dans la commande getpp:', error);
    await sock.sendMessage(message.key.remoteJid, { text: "Une erreur est survenue lors de la récupération de la photo." });
  }
}

module.exports = { sendProfilePicture };
