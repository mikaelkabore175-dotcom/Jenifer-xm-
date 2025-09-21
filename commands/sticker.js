//sticker.js
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const waSticker = require('wa-sticker-formatter'); // nécessite npm install wa-sticker-formatter ou équivalent
const fs = require('fs');
const path = require('path');

async function stickerCommand(sock, message) {
  try {
    // Vérifie si la commande est en réponse à un message média
    const context = message.message.extendedTextMessage?.contextInfo;
    if (!context || !context.quotedMessage) {
      return await sock.sendMessage(message.key.remoteJid, { text: 'Merci de répondre à un media (image ou vidéo) avec cette commande.' });
    }

    const quoted = context.quotedMessage;

    // Vérifier que le message cité est image ou vidéo
    if (!quoted.imageMessage && !quoted.videoMessage) {
      return await sock.sendMessage(message.key.remoteJid, { text: 'Le message répondu n\'est pas une image ou vidéo valide pour faire un sticker.' });
    }

    // Télécharger le média (buffer)
    const stream = await downloadMediaMessage(
      { message: quoted, key: { remoteJid: message.key.remoteJid, id: context.stanzaId, fromMe: false } },
      'buffer',
      {},
      {}
    );

    // Utiliser wa-sticker-formatter pour créer un sticker
    const sticker = new waSticker.Sticker(stream, {
      pack: 'Jenifer xm',
      author: 'Jenifer xm',
      type: waSticker.StickerTypes.FULL, // sticker cadré full
      quality: 70,
      keepScale: true,
      background: '#00000000' // transparent
    });

    const stickerBuffer = await sticker.toBuffer();

    // Envoyer le sticker et lien chaîne
    await sock.sendMessage(message.key.remoteJid, {
      sticker: stickerBuffer,
      text: '\n[Lien vers ma chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]',
    });

  } catch (error) {
    console.error('Erreur dans sticker.js:', error);
    await sock.sendMessage(message.key.remoteJid, { text: "Erreur lors de la création du sticker." });
  }
}

module.exports = { stickerCommand };
