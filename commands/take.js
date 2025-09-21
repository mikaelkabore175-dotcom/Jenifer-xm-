//take.js
async function sendStickerCopyCommand(sock, message) {
  try {
    // Vérifier si la commande est une réponse à un sticker
    if (!message.message.extendedTextMessage || !message.message.extendedTextMessage.contextInfo || !message.message.extendedTextMessage.contextInfo.quotedMessage) {
      return await sock.sendMessage(message.key.remoteJid, { text: "Merci de répondre à un sticker avec la commande !" });
    }

    const quoted = message.message.extendedTextMessage.contextInfo.quotedMessage;

    if (!quoted.stickerMessage) {
      return await sock.sendMessage(message.key.remoteJid, { text: "Le message répondu n'est pas un sticker !" });
    }

    // Extraire le sticker
    const sticker = quoted.stickerMessage;

    // Renvoie le sticker avec un message
    await sock.sendMessage(message.key.remoteJid, {
      sticker: sticker,
      text: "Voici une copie de ton sticker !\n\n[Le lien vers ma chaîne] : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100"
    });

  } catch (error) {
    console.error('Erreur dans la commande take:', error);
    await sock.sendMessage(message.key.remoteJid, { text: "Une erreur est survenue lors de la copie du sticker." });
  }
}

module.exports = { sendStickerCopyCommand };
