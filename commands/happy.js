//happy.js
const axios = require('axios');

async function sendHappyGif(sock, jid) {
  try {
    // Appeler l'API Nekos.best pour un gif happy anime
    const response = await axios.get('https://nekos.best/api/v2/happy');
    const gifUrl = response.data.results[0].url;

    // Envoyer le gif dans le chat
    await sock.sendMessage(jid, {
      video: { url: gifUrl },
      mimetype: 'video/mp4',
      caption: `[ Gif happy\nhttps://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100 ]`
    });

  } catch (error) {
    console.error('Erreur dans happy.js:', error);
    await sock.sendMessage(jid, { text: 'Désolé, impossible de récupérer un gif happy animé.' });
  }
}

module.exports = { sendHappyGif };
