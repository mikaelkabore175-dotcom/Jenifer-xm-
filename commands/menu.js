const { downloadContentFromMessage } = require('@whiskeysockets/baileys'); // adapte selon ta version
const axios = require('axios');

async function sendMenuCommand(sock, jid) {
  try {
    // Liens directs Google Drive
    const videoUrl = 'https://drive.google.com/uc?export=download&id=1ECt89Q23IRi5nCXGaGd5hi5cSVoRswWz';
    const audioUrl = 'https://drive.google.com/uc?export=download&id=1puuNjNr9A8iai3wldkBlUvOuCBobis6-';

    // Télécharger la vidéo en buffer
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    // Envoyer la vidéo en message media
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: 'jenifer_video.mp4',
      caption: 'Voici la vidéo de Jenifer xm 🚀'
    });

    // Message texte du menu
    const menuMessage = `
┏━━〔 🤖𝙟𝙚𝙣𝙞𝙛𝙚𝙧 𝙭𝙢 〕━━━━┓
┃ 🚀 powered by Jenifer xm 
┃ ⏱️ 2025
┃ 🔖 Version  : v1
┗━━━━━━━━━━━━━━━━━━┛
         ┏━━𝕍𝕚𝕤𝕚𝕓𝕝𝕖 𝕞𝕖𝕟𝕦━━┓
〇!ping
〇!tagall
〇!tagadmin
〇!loc
〇!img
〇!song
〇!yt_download
〇!tiktok
〇!menu
〇!motivation
〇!aud
〇!vid
〇!info
〇!contact
〇!sticker
         ┏━━admins-menu━━┓
♛!kickall
♛!ban
♛!vu
♛!getpp
♛!antilink
♛!antibot
♛!antimedia 
♛!promote 
♛!demote
♛!take
              ┏━━stockage━━┓
〔!store
〔!listermedia 
            ┏━━ROYAL menu━━┓
☬!suicide 
     ━━━━━━━━━━━━━━━━━━━━
channel link :
https://whatsapp.com/channel/0029VbBdiAC1t90TpAoeGS20
web link: no available🕓
> Powered by Jenifer xm
GitHub link: 
https://github.com/mikaelkabore175-dotcom/Jenifer-xm-
    `;

    // Envoyer le message texte
    await sock.sendMessage(jid, { text: menuMessage });

    // Télécharger l'audio en buffer
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const audioBuffer = Buffer.from(audioResponse.data);

    // Envoyer l'audio en message vocal (PTT)
    await sock.sendMessage(jid, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg', // ou audio/ogg selon format
      ptt: true, // message vocal
      fileName: 'jenifer_audio.mp3'
    });

  } catch (error) {
    console.error('Erreur dans la commande menu:', error);
    await sock.sendMessage(jid, { text: 'Désolé, une erreur est survenue lors de l\'envoi du menu.' });
  }
}

// Utilisation dans le handler des commandes avec Baileys:
// if(command === 'menu'){
//   await sendMenuCommand(sock, from);
// }

module.exports = { sendMenuCommand };
