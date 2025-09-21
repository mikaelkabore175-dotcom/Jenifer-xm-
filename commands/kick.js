//kick.js
async function kickMember(sock, message, sender, admins) {
  try {
    const jid = message.key.remoteJid;

    // Vérifier que c'est un groupe
    if (!jid.endsWith('@g.us')) {
      return await sock.sendMessage(jid, { text: "Cette commande ne fonctionne que dans les groupes." });
    }

    // Vérifier que l'utilisateur est un administrateur
    if (!admins.includes(sender)) {
      return await sock.sendMessage(jid, { text: "Seuls les administrateurs peuvent utiliser cette commande." });
    }

    // Vérifier si c'est une réponse à un message d'un membre ciblé
    const context = message.message.extendedTextMessage?.contextInfo;
    if (!context || !context.participant) {
      return await sock.sendMessage(jid, { text: "Merci de répondre à un message de la personne à exclure." });
    }

    const target = context.participant;

    // Exclure le membre du groupe
    await sock.groupParticipantsUpdate(jid, [target], 'remove');

    await sock.sendMessage(jid, {
      text: `L'utilisateur @${target.split('@')[0]} a été exclu du groupe.`,
      mentions: [target]
    });

  } catch (error) {
    console.error("Erreur lors de l'exclusion du membre :", error);
    await sock.sendMessage(message.key.remoteJid, { text: "Erreur lors de l'exclusion du membre." });
  }
}

module.exports = { kickMember };
