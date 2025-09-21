//vu.js
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');

async function sendViewOnceMedia(sock, message) {
  try {
    const jid = message.key.remoteJid;

    // Vérifier si le message est bien un view once
    let isViewOnce = false;
    // Dans Baileys, c'est souvent marqué dans contextInfo
    if (
      message.message &&
      message.message[Object.keys(message.message)[0]]?.viewOnce
    ) {
      isViewOnce = true;
    }

    if (!isViewOnce) {
      return await sock.sendMessage(jid, { text: 'Ce message n\'est pas un média à vue unique.' });
    }

    // Télécharger le média (si Baileys supporte la fonction)
    const mediaMessage = message.message;

    const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {}, {});

    // Identifier type mime
    const messageType = Object.keys(mediaMessage)[0];
    let mime = '';

    switch (messageType) {
      case 'imageMessage':
        mime = 'image/jpeg'; break;
      case 'videoMessage':
        mime = 'video/mp4'; break;
      case 'audioMessage':
        mime = 'audio/mpeg'; break;
      default:
        mime = '';
    }

    // Envoyer le média téléchargé
    await sock.sendMessage(jid, {
      [messageType.replace('Message', '')]: buffer,
      mimetype: mime,
      caption: '> Powered by Jenifer xm',
    });

  } catch (error) {
    console.error('Erreur renvoi média view once:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'Erreur lors du traitement du média view once.' });
  }
}

module.exports = { sendViewOnceMedia };
