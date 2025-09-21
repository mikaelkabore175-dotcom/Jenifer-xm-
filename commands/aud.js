//aud.js
const axios = require('axios');

async function sendAudioCommand(sock, jid) {
  try {
    // Lien direct Google Drive (conversion du lien partagé)
    const audioUrl = 'https://drive.google.com/uc?export=download&id=1puuNjNr9A8iai3wldkBlUvOuCBobis6-';

    // Télécharger l'audio en buffer
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const audioBuffer = Buffer.from(audioResponse.data);

    // Envoyer l'audio en message vocal (push-to-talk)
    await sock.sendMessage(jid, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg', // ou audio/ogg selon le format exact
      ptt: true,              // message vocal
      fileName: 'jenifer_audio.mp3'
    });
  } catch (error) {
    console.error('Erreur dans la commande aud:', error);
    await sock.sendMessage(jid, { text: "Désolé, je n'ai pas pu envoyer l'audio." });
  }
}

module.exports = { sendAudioCommand };
