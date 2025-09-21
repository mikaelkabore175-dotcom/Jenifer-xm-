//antimedia.js
// Stockage de l'état antimedia par groupe (à adapter avec une base réelle)
if (!global.antimediaStatus) global.antimediaStatus = {};

async function toggleAntimedia(sock, jid, command, sender) {
  // Vérification de l'état admin est à faire avant d'appeler cette fonction

  if (command === 'antimediaon') {
    global.antimediaStatus[jid] = true;
    await sock.sendMessage(jid, { text: 'Antimedia activé ✅' });
  } else if (command === 'antimediaoff') {
    global.antimediaStatus[jid] = false;
    await sock.sendMessage(jid, { text: 'Antimedia désactivé ❌' });
  }
}

async function handleMediaMessages(sock, message) {
  const jid = message.key.remoteJid;
  if (!global.antimediaStatus || !global.antimediaStatus[jid]) return; // antimedia off

  // Vérifier si message contient média
  const messageType = Object.keys(message.message)[0];
  const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'];

  if (mediaTypes.includes(messageType)) {
    // Supprimer message média
    try {
      await sock.sendMessage(jid, {
        text: `🤖༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒🤖\nDésolé l'antimedia est activé donc impossible d'envoyer un media ici\n\n[Lien vers ma chaîne WhatsApp] : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100`
      });
      await sock.sendMessage(jid, {
        delete: { remoteJid: jid, fromMe: false, id: message.key.id, participant: message.key.participant }
      }).catch(() => null); // ignore delete errors
    } catch (error) {
      console.error('Erreur suppression media antimedia:', error);
    }
  }
}

module.exports = { toggleAntimedia, handleMediaMessages };
