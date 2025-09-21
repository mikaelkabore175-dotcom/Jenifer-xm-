//autoreact.js
const AUTO_REACT_EMOJIS = ['🦭','🦢','🦃','🦐','🕷️','🪸','🐠','🦪','🪼','🐌','🦟','🪱','🦋','🐝','🪼','🩵','🔥','💯','💝','💘','❤️‍🔥','👀','🩸','👊🏼','🌹','🌷','🌸','🌈','🤭','👻','🤠','👽','🌚','🌝','⛄','☃️','🩵','💚','🤎','🖤','👥','💪🏼','👏🏼','🍰','🍮','🍥','🧈','🍵','🍼','🍷','🍾','🥂','🍺','🍬','🍭','🥮','🥠','🍣','🍝','🍔','🌭','🥪'];

if (!global.autoReactStatus) global.autoReactStatus = {};

function getRandomEmoji() {
  return AUTO_REACT_EMOJIS[Math.floor(Math.random() * AUTO_REACT_EMOJIS.length)];
}

async function toggleAutoReact(sock, jid, sender, command, admins) {
  if (!admins.includes(sender)) {
    await sock.sendMessage(jid, { text: 'Commande réservée aux administrateurs.' });
    return;
  }

  if (command === '!autoreacton') {
    global.autoReactStatus[jid] = true;
    await sock.sendMessage(jid, { text: 'Réactions automatiques activées ✅' });
  } else if (command === '<!autoreactoff>') {
    global.autoReactStatus[jid] = false;
    await sock.sendMessage(jid, { text: 'Réactions automatiques désactivées ❌' });
  }
}

async function handleAutoReact(sock, message) {
  const jid = message.key.remoteJid;
  if (!global.autoReactStatus[jid]) return; // auto react désactivé

  try {
    // Envoyer réaction emoji aléatoire
    const emoji = getRandomEmoji();
    await sock.sendMessage(jid, {
      react: {
        text: emoji,
        key: message.key
      }
    });
  } catch (error) {
    console.error('Erreur dans autoreact:', error);
  }
}

module.exports = { toggleAutoReact, handleAutoReact };
