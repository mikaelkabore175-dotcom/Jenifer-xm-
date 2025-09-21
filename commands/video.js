//video.js
const axios = require('axios');

async function sendVideo(sock, jid) {
  try {
    const videoUrl = 'https://drive.google.com/uc?export=download&id=1ECt89Q23IRi5nCXGaGd5hi5cSVoRswWz';

    // Télécharger la vidéo en buffer
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    const caption = `🅙︎🅔︎🅝︎🅘︎🅕︎🅔︎🅡︎  Ⓧ︎Ⓜ︎
🧿 𝔑𝔈𝔚  𝔊𝔈𝔑𝔈ℜ𝔄𝔗𝔍𝔒𝔑
⚜️𝕋ℍ𝔼𝕄𝔼:𝐋𝐈𝐌𝐔𝐋𝐄 𝐓𝐄𝐌𝐏𝐄𝐒𝐓🔱
ˡᵃ ᵛⁱᵉ ᵃ ᵖᵃʳᶠᵒⁱˢ ᵘⁿ ˢᵉⁿˢ ᵗᵘ ˢᵃⁱˢ , ᵖᵃˢ ᵇᵉˢᵒⁱⁿ ᵈ'ᵉᵗʳᵉ ᵘⁿ ᵍᵉⁿⁱᵉ ᵒᵘ ᵉᵗʳᵉ ˡᵉ ᵖˡᵘˢ ᶠᵒʳᵗ ᵖᵒᵘʳ ᵐᵒᵈᵉʳᵉʳ , ᵃˡᵒʳˢ ʳᵉᵛᵉⁱˡˡᵉ ᵗᵒⁱ ᶜᵒⁿˢᵗʳᵘⁱᵗ ᵗᵃ ᵖᵘᵗᵃⁱⁿ ᵈᵉ ˡⁱᶠᵉ , ᶜᵉ ⁿ'ᵉˢᵗ ᵠᵘ'à ᶜᵉᵗ ⁱⁿᵗᵃⁿᵗ ˡà ᵠᵘᵉ ᵗᵘ ᵛᵉʳʳᵃˢ ᵘⁿᵉ ᵐᵉⁱˡˡᵉᵘʳᵉ ᵛⁱˢⁱᵒⁿ ᵈᵉˢ ᶜʰᵒˢᵉˢ ,ˡᵉ ᵐᵒⁿᵈᵉ ᵉˢᵗ ʳᵉᵐᵖˡⁱ ᵈᵉ ᶜʰᵒˢᵉˢ ᵐᵉʳᵛᵉⁱˡˡᵉᵘˢᵉˢ 
📽️𝙑𝙄𝘿𝙀𝙊 𝙀𝘿𝙄𝙏𝙊𝙍
> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙹𝙴𝙽𝙸𝙵𝙴𝚁 𝚇𝙼 🌹

+ Le lien de la chaine WhatsApp en arrière plan : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/9223372036854675807
`;

    // Envoyer la vidéo avec la légende
    await sock.sendMessage(jid, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      caption,
      fileName: 'limule_tempest_hd.mp4'
    });

  } catch (error) {
    console.error('Erreur dans video.js:', error);
    await sock.sendMessage(jid, { text: 'Désolé, impossible de récupérer ou d\'envoyer la vidéo.' });
  }
}

module.exports = { sendVideo };
