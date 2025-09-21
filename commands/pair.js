//pair.js
function generateRandomCode() {
  const prefix = '+226';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return prefix + code;
}

async function sendPairCode(sock, jid) {
  try {
    const code = generateRandomCode();
    const message = `༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒/pair\nPair: ${code}`;
    await sock.sendMessage(jid, { text: message });
  } catch (error) {
    console.error('Erreur dans pair.js:', error);
    await sock.sendMessage(jid, { text: "Erreur lors de la génération du code de pairage." });
  }
}

module.exports = { sendPairCode };
