//tagall.js
async function tagAllMembers(sock, jid, sender) {
  try {
    if (!jid.endsWith('@g.us')) {
      return await sock.sendMessage(jid, { text: 'Cette commande fonctionne uniquement dans les groupes.' });
    }

    // Obtenir les métadonnées du groupe
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants;
    const admins = participants.filter(p => p.admin !== null).map(p => p.id);
    
    // Vérifier que le demandeur est admin
    if (!admins.includes(sender)) {
      return await sock.sendMessage(jid, { text: 'Seuls les administrateurs peuvent utiliser cette commande.' });
    }

    // Construire le message avec tags
    const membersCount = participants.length;
    let textMessage = `༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒/appel aux membres du groupe\nNombre: ${membersCount}\n`;

    const mentions = [];
    for (const participant of participants) {
      const userId = participant.id.split('@')[0];
      textMessage += `༒@${userId}\n`;
      mentions.push(participant.id);
    }

    textMessage += `\n[Lien vers ma chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]`;

    // Envoyer le message en mentionnant tous les membres
    await sock.sendMessage(jid, { text: textMessage, mentions: mentions });

  } catch (error) {
    console.error('Erreur dans tagall.js:', error);
    await sock.sendMessage(jid, { text: 'Une erreur est survenue lors du tag de tous les membres.' });
  }
}

module.exports = { tagAllMembers };
