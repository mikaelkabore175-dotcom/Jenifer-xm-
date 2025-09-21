//mute.js
async function muteGroup(sock, jid, sender, admins, command) {
  if (!admins.includes(sender)) {
    await sock.sendMessage(jid, { text: "Commande réservée aux administrateurs." });
    return;
  }

  try {
    if (command === 'mute') {
      // Passer le groupe en mode annonce : seuls les admins peuvent envoyer des messages
      await sock.groupSettingUpdate(jid, 'announcement');
      await sock.sendMessage(jid, {
        text: "Le groupe est maintenant en mode silencieux : seuls les administrateurs peuvent envoyer des messages.\n\n[Lien vers ma chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]"
      });
    } else if (command === 'unmute') {
      // Rétablir l'envoi de messages à tous les membres
      await sock.groupSettingUpdate(jid, 'not_announcement');
      await sock.sendMessage(jid, {
        text: "Le groupe est réactivé : tous les membres peuvent envoyer des messages.\n\n[Lien vers ma chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]"
      });
    }
  } catch (error) {
    console.error('Erreur dans la commande mute:', error);
    await sock.sendMessage(jid, { text: 'Une erreur est survenue lors du changement du mode du groupe.' });
  }
}

module.exports = { muteGroup };
