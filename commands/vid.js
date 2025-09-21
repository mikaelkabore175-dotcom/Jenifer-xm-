//vid.js
const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function sendVideoCommand(sock, jid, videoName) {
  try {
    // Message de recherche
    await sock.sendMessage(jid, {
      text: '🤖༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒🤖\nRecherche pour vidéo...'
    });

    // Exemple de recherche YouTube (à remplacer par une vraie recherche)
    // Ici on prend un lien fixe pour l'exemple :
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // remplacer par recherche + choix

    // Télécharger vidéo en mp4 (limiter la taille pour WhatsApp, max ~16MB)
    const videoPath = path.resolve(__dirname, 'temp_video.mp4');
    const videoStream = ytdl(videoUrl, { filter: 'audioandvideo', quality: 'highestvideo' })
      .pipe(fs.createWriteStream(videoPath));

    await new Promise((resolve, reject) => {
      videoStream.on('finish', resolve);
      videoStream.on('error', reject);
    });

    // Envoyer la vidéo téléchargée
    const videoBuffer = fs.readFileSync(videoPath);
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'video.mp4',
      caption: `Voici la vidéo: ${videoName}`
    });

    // Supprimer fichier temporaire
    fs.unlinkSync(videoPath);

  } catch (error) {
    console.error('Erreur dans commande vid:', error);
    await sock.sendMessage(jid, { text: 'Désolé, la vidéo n\'a pas pu être téléchargée ou envoyée.' });
  }
}

module.exports = { sendVideoCommand };
