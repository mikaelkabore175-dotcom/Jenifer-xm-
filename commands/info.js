//info.js
const axios = require('axios');

async function sendBotInfo(sock, jid) {
  try {
    const videoUrl = 'https://drive.google.com/uc?export=download&id=1ECt89Q23IRi5nCXGaGd5hi5cSVoRswWz';

    // Télécharger la vidéo en buffer
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    // Texte info du bot
    const infoText = `
༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒
#Bot WhatsApp utilisant baileys 
#nom du bot : 𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈
#version : 1.0
#author : Jenifer xm 
#soutien : chat gpt et Mikaël Kabore 
#web link : no available 
#channel link : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100
    `;

    // Envoyer la vidéo avec la légende info
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'jenifer_info_video.mp4',
      caption: infoText.trim(),
    });

  } catch (error) {
    console.error('Erreur dans info.js:', error);
    await sock.sendMessage(jid, { text: 'Désolé, impossible de récupérer les informations du bot.' });
  }
}

module.exports = { sendBotInfo };
