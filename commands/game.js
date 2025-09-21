//game.js
const MAX_PARTICIPANTS = 30;

let gameState = {
  active: false,
  participants: [],
  messageId: null,
};

async function startGame(sock, jid, message) {
  if (gameState.active) {
    return await sock.sendMessage(jid, { text: "Un jeu est déjà en cours. Répondez avec <Y> pour rejoindre." });
  }

  gameState.active = true;
  gameState.participants = [];
  gameState.messageId = message.key.id;

  const msg = `
#game: Bienvenue dans le jeu Jenifer xm!
#nombre de participants : 0
#auteur: @${message.key.participant.split('@')[0]}

Répondez avec <Y> pour rejoindre. Maximum ${MAX_PARTICIPANTS} joueurs.
`;

  await sock.sendMessage(jid, {
    text: msg,
    mentions: [message.key.participant]
  });
}

async function joinGame(sock, jid, message, text) {
  if (!gameState.active) return;

  // S'assurer que le message est en réponse au message du jeu
  if (message.message.extendedTextMessage?.contextInfo?.stanzaId !== gameState.messageId) return;

  if (text.trim().toUpperCase() === '<Y>') {
    const sender = message.key.participant || message.key.remoteJid;
    if (gameState.participants.includes(sender)) return; // déjà inscrit

    if (gameState.participants.length >= MAX_PARTICIPANTS) {
      await sock.sendMessage(jid, { text: "Le nombre maximal de participants a été atteint." });
      return;
    }

    gameState.participants.push(sender);

    const updateMsg = `
#game: Partie en cours - participants mis à jour
#nombre de participants : ${gameState.participants.length}
#auteur: @${message.key.participant.split('@')[0]}
`;

    await sock.sendMessage(jid, {
      text: updateMsg,
      mentions: gameState.participants
    });
  }
}

async function stopGame(sock, jid, sender) {
  if (!gameState.active) {
    await sock.sendMessage(jid, { text: "Aucun jeu en cours à arrêter." });
    return;
  }

  // Vérifier que le stop soit demandé par un participant autorisé (admin ou membre liste)
  // Ici simplifié sans vérification, adapter selon besoin

  const remaining = gameState.participants.length;
  gameState.active = false;

  await sock.sendMessage(jid, {
    text: `🚫 échec et mat participants restants : ${remaining}`
  });
}

async function endGame(sock, jid) {
  if (!gameState.active) return;
  if (gameState.participants.length === 0) {
    gameState.active = false;
    await sock.sendMessage(jid, { text: "Le jeu est terminé, aucun participant." });
    return;
  }

  // Choisir un gagnant aléatoire
  const winnerIndex = Math.floor(Math.random() * gameState.participants.length);
  const winner = gameState.participants[winnerIndex];

  gameState.active = false;

  const msg = `
Le jeu est terminé ! Félicitations au vainqueur @${winner.split('@')[0]} 🎉

#game: Fin de partie
#nombre de participants: ${gameState.participants.length}
#auteur: @${winner.split('@')[0]}
`;

  await sock.sendMessage(jid, {
    text: msg,
    mentions: [winner]
  });
}

// Dans le gestionnaire des messages, il faudra appeler ces fonctions selon les commandes reçues :

/*
if (text === '!game') {
  await startGame(sock, jid, message);
} else if (text.toUpperCase() === '<Y>') {
  await joinGame(sock, jid, message, text);
} else if (text === '<!stopgame>') {
  await stopGame(sock, jid, sender);
}
*/

// Après une condition (par exemple un timeout ou un certain tour), appeler endGame(sock, jid) pour conclure.

module.exports = { startGame, joinGame, stopGame, endGame };
