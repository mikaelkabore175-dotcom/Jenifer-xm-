//date.js
const axios = require('axios');

function convertGDriveUrlToDirect(url) {
  const regex = /https:\\/\\/drive\\.google\\.com\\/file\\/d\\/([a-zA-Z0-9_-]+)\\//;
  const match = url.match(regex);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return null;
}

async function sendDateCommand(sock, jid) {
  try {
    // URL partagée Google Drive
    const imageUrlShare = 'https://drive.google.com/file/d/1I58M4NAERamDSPw-1kSssUajiHc5YWDO/view?usp=drivesdk';
    // Conversion en lien direct
    const imageUrlDirect = imageUrlShare.replace('/file/d/', '/uc?export=download&id=').split('/view')[0];

    // Obtenir date et heure locale serveur (peut s'adapter selon besoin vrai fuseau utilisateur)
    const dateNow = new Date();
    const dateStr = dateNow.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'medium' });

    // Télécharger l'image en buffer
    const imageResponse = await axios.get(imageUrlDirect, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Envoyer l'image HD
    await sock.sendMessage(jid, {
      image: imageBuffer,
      caption: `🕒 Date et heure actuelles :\n${dateStr}`,
      mimetype: 'image/jpeg',
      fileName: 'date_image.jpg'
    });
  } catch (error) {
    console.error('Erreur envoie commande date:', error);
    await sock.sendMessage(jid, { text: "Désolé, je n'ai pas pu récupérer la date et l'image." });
  }
}

module.exports = { sendDateCommand };
