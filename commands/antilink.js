//antilink.js
// Stockage de l'état antilink par groupe
if (!global.antilinkStatus) global.antilinkStatus = {};
// Suivi du nombre d'avertissements par utilisateur par groupe
if (!global.antilinkWarnings) global.antilinkWarnings = {};

async function toggleAntilink(sock, jid, command, sender, admins) {
  if (!admins.includes(sender)) {
    await sock.sendMessage(jid, { text: "Commande réservée aux administrateurs." });
    return;
  }

  if (command === 'antilinkon') {
    global.antilinkStatus[jid] = true;
    await sock.sendMessage(jid, { text: 'Antilink activé ✅' });
  } else if (command === 'antilinkoff') {
    global.antilinkStatus[jid] = false;
    await sock.sendMessage(jid, { text: 'Antilink désactivé ❌' });
    // Réinitialiser avertissements
    if (global.antilinkWarnings[jid]) delete global.antilinkWarnings[jid];
  }
}

function containsLink(text) {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  return linkRegex.test(text);
}

async function handleMessagesForAntilink(sock, message) {
  const jid = message.key.remoteJid;
  if (!global.antilinkStatus || !global.antilinkStatus[jid]) return;

  const sender = message.key.participant || message.key.remoteJid;
  const text = message.message.conversation || message.message.extendedTextMessage?.text;
  if (!text) return;

  if (containsLink(text)) {
    // Supprimer message
    try {
      await sock.sendMessage(jid, {
        text: `🤖༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒🤖\nDésolé l'antilink est activé, donc impossible d'envoyer un lien ici, tu peux demander à un administrateur de le désactiver si possible.\n\n[Lien vers ma chaîne WhatsApp] : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100`,
        mentions: [sender],
      });
      await sock.sendMessage(jid, {
        delete: { remoteJid: jid, fromMe: false, id: message.key.id, participant: sender },
      });
    } catch (error) {
      console.error('Erreur suppression message lien:', error);
    }

    // Gestion des avertissements
    if (!global.antilinkWarnings[jid]) global.antilinkWarnings[jid] = {};
    if (!global.antilinkWarnings[jid][sender]) global.antilinkWarnings[jid][sender] = 0;
    global.antilinkWarnings[jid][sender]++;

    const warns = global.antilinkWarnings[jid][sender];
    if (warns >= 3) {
      // Exclure l'utilisateur du groupe
      try {
        await sock.groupParticipantsUpdate(jid, [sender], 'remove');
        await sock.sendMessage(jid, {
          text: `L'utilisateur @${sender.split('@')[0]} a été exclu pour avoir envoyé trop de liens.`,
          mentions: [sender],
        });
        delete global.antilinkWarnings[jid][sender];
      } catch (e) {
        console.error('Erreur lors de l\'exclusion pour liens:', e);
      }
    } else {
      // Avertir le membre du nombre d'avertissements
      await sock.sendMessage(jid, {
        text: `Avertissement ${warns}/3 pour @${sender.split('@')[0]} concernant l'envoi de liens.`,
        mentions: [sender],
      });
    }
  }
}

module.exports = { toggleAntilink, handleMessagesForAntilink };
