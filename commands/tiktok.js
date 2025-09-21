//tiktok.js
const TikTokScraper = require('tiktok-scraper'); // npm install tiktok-scraper
const axios = require('axios');

async function sendTikTokMedia(sock, jid, url) {
  try {
    // Récupérer les données et le lien vidéo sans filigrane
    const videoMeta = await TikTokScraper.getVideoMeta(url, { noWaterMark: true });

    const {
      authorMeta,
      videoUrl,
      text,
      stats
    } = videoMeta;

    // Télécharger la vidéo en buffer
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    // Préparer les hashtags extraits du texte
    const hashtags = (text.match(/#[a-zA-Z0-9_]+/g) || []).join(' ');

    // Préparer le message d'information
    const infoMessage = `
Auteur 👤 : ${authorMeta.name}
Durée ⏱️ : ${Math.round(videoMeta.duration)} seconds
Type de media 📷 : video
Likes ❤️ : ${stats.diggCount}
Commentaires 🗨️ : ${stats.commentCount}
Hashtags intégrés #️⃣ : ${hashtags}

[Lien vers ma chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100]
    `;

    // Envoyer la vidéo avec la légende info
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      caption: infoMessage.trim(),
      fileName: 'tiktok_video.mp4',
    });

  } catch (error) {
    console.error('Erreur tiktok.js:', error);
    await sock.sendMessage(jid, { text: 'Désolé, impossible de récupérer ou d\'envoyer la vidéo TikTok.' });
  }
}

module.exports = { sendTikTokMedia };
