//loc.js
const axios = require('axios');

async function sendLocationInfo(sock, message) {
  const jid = message.key.remoteJid;

  try {
    // Vérifier que la commande est en réponse à un message
    if (
      !message.message.extendedTextMessage ||
      !message.message.extendedTextMessage.contextInfo ||
      !message.message.extendedTextMessage.contextInfo.quotedMessage
    ) {
      return await sock.sendMessage(jid, { text: "Merci de répondre à un message de la personne ciblée." });
    }

    // Obtenir le JID de la personne ciblée
    const targetJid = message.message.extendedTextMessage.contextInfo.participant;

    // Télécharger l'image depuis Google Drive (lien converti en lien direct)
    const imageDriveUrl = 'https://drive.google.com/uc?export=download&id=1I58M4NAERamDSPw-1kSssUajiHc5YWDO';
    const imageResponse = await axios.get(imageDriveUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Simuler la récupération de la localisation (à remplacer par vraie API géolocalisation)
    // Ici on met des données d'exemple statiques, car Baileys ne fournit pas la géolocalisation d'un utilisateur
    const longitude = '2.3522';
    const latitude = '48.8566';
    const continent = 'Europe';
    const pays = 'France';
    const ville = 'Paris';
    const quartier = '1er arrondissement';

    const locationMessage = `
༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒/Loc
#longitude: ${longitude}
#latitude: ${latitude}
#continent: ${continent}
#pays: ${pays}
#ville: ${ville}
#quartier: ${quartier}

[Lien vers ma chaîne WhatsApp : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]
`;

    // Envoyer l'image
    await sock.sendMessage(jid, {
      image: imageBuffer,
      caption: locationMessage.trim(),
      mimetype: 'image/jpeg',
      fileName: 'location_image.jpg'
    });

  } catch (error) {
    console.error('Erreur dans loc.js:', error);
    await sock.sendMessage(jid, { text: "Impossible de récupérer la localisation et l'image." });
  }
}

module.exports = { sendLocationInfo };
