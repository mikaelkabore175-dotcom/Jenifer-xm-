//motivation.js
const axios = require('axios');

async function sendMotivationNote(sock, jid) {
  try {
    const videoUrl = 'https://drive.google.com/uc?export=download&id=1ECt89Q23IRi5nCXGaGd5hi5cSVoRswWz';

    // Télécharger la vidéo en buffer
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    // Envoyer la vidéo en note vidéo (video note)
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'motivation_note.mp4',
      ptt: true,  // Indique que c’est une note vidéo (push-to-talk)
    });
  } catch (error) {
    console.error('Erreur dans motivation.js:', error);
    await sock.sendMessage(jid, { text: 'Désolé, impossible d\'envoyer la note vidéo.' });
  }
}

module.exports = { sendMotivationNote };
