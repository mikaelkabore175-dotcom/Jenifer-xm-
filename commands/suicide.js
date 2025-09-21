//suicide.js
let suicideIntervals = {};

async function suicideCommand(sock, jid) {
  if (suicideIntervals[jid]) {
    return await sock.sendMessage(jid, { text: "Le processus suicide est déjà en cours dans ce groupe." });
  }

  await sock.sendMessage(jid, {
    text: "Processus enclenché 😫\nRépondez <y> pour continuer et <n> pour arrêter.",
  });

  suicideIntervals[jid] = setInterval(async () => {
    try {
      // Envoyer le message automatisé
      const sentMsg = await sock.sendMessage(jid, {
        text: "https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100",
      });

      // Réagir avec 😫
      await sock.sendMessage(jid, {
        react: {
          text: "😫",
          key: sentMsg.key,
        }
      });

    } catch (error) {
      console.error("Erreur durant l'envoi suicide : ", error);
    }
  }, 5000); // toutes les 5 secondes, ajustable
}

async function handleSuicideControl(sock, jid, text) {
  if (!suicideIntervals[jid]) return;

  text = text.toLowerCase();

  if (text === '<y>') {
    await sock.sendMessage(jid, { text: "Processus suicide continue..." });
  } else if (text === '<n>') {
    clearInterval(suicideIntervals[jid]);
    delete suicideIntervals[jid];
    await sock.sendMessage(jid, { text: "Processus suicide arrêté." });
  }
}

module.exports = { suicideCommand, handleSuicideControl };
