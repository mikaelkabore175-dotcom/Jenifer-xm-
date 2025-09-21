//promote.js
async function promoteCommand(sock, message, commandArgs) {
  try {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      return await sock.sendMessage(from, { text: 'Cette commande est uniquement disponible dans les groupes.' });
    }

    // Vérifie si l'auteur est admin du groupe
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
    if (!admins.includes(message.key.participant || message.key.remoteJid)) {
      return await sock.sendMessage(from, { text: 'Vous devez être admin du groupe pour utiliser cette commande.' });
    }

    // Détecter le participant à promouvoir
    let userId;
    if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo && message.message.extendedTextMessage.contextInfo.mentionedJid && message.message.extendedTextMessage.contextInfo.mentionedJid.length > 0) {
      // Promote via tag
      userId = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo && message.message.extendedTextMessage.contextInfo.quotedMessage) {
      // Promote via réponse à message
      userId = message.message.extendedTextMessage.contextInfo.participant;
    } else {
      return await sock.sendMessage(from, { text: 'Veuillez répondre au message de la personne à promouvoir ou la tagger avec @.' });
    }

    // Promouvoir l'utilisateur
    await sock.groupParticipantsUpdate(from, [userId], 'promote');

    // Envoyer confirmation avec lien chaîne
    await sock.sendMessage(from, {
      text: `L'utilisateur @${userId.split('@')[0]} a été promu administrateur ✅\n\n[Lien vers ma chaîne WhatsApp] : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100`,
      mentions: [userId],
    });

  } catch (error) {
    console.error('Erreur dans la commande promote:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'Une erreur est survenue lors de la promotion.' });
  }
}

module.exports = { promoteCommand };
