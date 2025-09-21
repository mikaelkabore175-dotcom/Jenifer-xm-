// utils/messageUtils.js

/**
 * Récupère le texte d'un message, quelle que soit sa forme (text, extendedTextMessage...)
 * @param {import('@whiskeysockets/baileys').proto.IMessage} message
 * @returns {string} texte extrait ou chaîne vide
 */
function getMessageText(message) {
  if (!message) return '';

  if (message.conversation) {
    return message.conversation;
  }

  if (message.extendedTextMessage && message.extendedTextMessage.text) {
    return message.extendedTextMessage.text;
  }

  if (message.imageMessage && message.imageMessage.caption) {
    return message.imageMessage.caption;
  }

  if (message.videoMessage && message.videoMessage.caption) {
    return message.videoMessage.caption;
  }
  
  if (message.listResponseMessage && message.listResponseMessage.title) {
    return message.listResponseMessage.title;
  }

  if (message.buttonsResponseMessage && message.buttonsResponseMessage.selectedButtonId) {
    return message.buttonsResponseMessage.selectedButtonId;
  }

  return '';
}

/**
 * Récupère la liste des mentions (ids) dans un message
 * @param {import('@whiskeysockets/baileys').proto.IMessage} message 
 * @returns {string[]} tableau des ids mentionnés (ex: ["123456@s.whatsapp.net"])
 */
function getMentions(message) {
  if (!message || !message.extendedTextMessage) return [];
  return message.extendedTextMessage.contextInfo?.mentionedJid || [];
}

/**
 * Vérifie si un message est une réponse (reply)
 * @param {import('@whiskeysockets/baileys').proto.IMessage} message 
 * @returns {boolean}
 */
function isReply(message) {
  return Boolean(message?.extendedTextMessage?.contextInfo?.quotedMessage);
}

module.exports = {
  getMessageText,
  getMentions,
  isReply,
};
