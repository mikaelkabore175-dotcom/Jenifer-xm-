//autovustatut.js
let autoStatusRunning = false;

async function startAutoViewStatus(sock) {
  if (autoStatusRunning) return;
  autoStatusRunning = true;

  try {
    const stories = await sock.fetchStatusV3();

    for (const status of stories) {
      if (!autoStatusRunning) break;
      try {
        await sock.sendReadStatus(status.id);

        // Auto-like en envoyant une réaction sur le statut
        // Baileys ne supporte pas nativement le like, mais on peut envoyer une réaction "texte"
        await sock.sendMessage(status.jid, {
          react: {
            text: '❤️',
            key: { remoteJid: status.jid, id: status.id }
          }
        });

      } catch (err) {
        console.error('Erreur auto vu status:', err);
      }
    }
  } catch (error) {
    console.error('Erreur récupération statuts:', error);
  }
}

async function stopAutoViewStatus() {
  autoStatusRunning = false;
}

module.exports = { startAutoViewStatus, stopAutoViewStatus };
