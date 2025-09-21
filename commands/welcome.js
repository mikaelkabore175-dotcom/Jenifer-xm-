//welcome.js
async function toggleWelcome(sock, jid, command) {
  // stocker état activation (à mettre dans une DB ou en mémoire selon architecture)
  // Ici on simule avec un objet en mémoire
  if (!global.welcomeStatus) global.welcomeStatus = {};
  if (command === 'welcomeon') {
    global.welcomeStatus[jid] = true;
    await sock.sendMessage(jid, { text: 'Message de bienvenue activé ✅' });
  } else if (command === 'welcomeoff') {
    global.welcomeStatus[jid] = false;
    await sock.sendMessage(jid, { text: 'Message de bienvenue désactivé ❌' });
  }
}

async function onGroupParticipantUpdate(sock, update) {
  const { id, participants, action } = update; // id = groupJid, participants = array new members
  if (!global.welcomeStatus || !global.welcomeStatus[id]) return; // welcome off
  if (action !== 'add') return; // on ne gère que les ajouts

  for (const participant of participants) {
    try {
      // Obtention infos du groupe
      const groupMetadata = await sock.groupMetadata(id);
      const groupName = groupMetadata.subject;
      const desc = groupMetadata.desc || 'Aucune description';
      const membersCount = groupMetadata.participants.length;
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => `@${p.id.split('@')[0]}`);
      
      // Profil photo nouveau membre
      let pfpUrl = null;
      try {
        pfpUrl = await sock.profilePictureUrl(participant, 'image');
      } catch { 
        pfpUrl = null; // si pas de photo
      }

      // Construire message
      const welcomeText = `༒𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈༒\n               🤖\nBienvenue dans ce groupe\n@${participant.split('@')[0]}\n#Description:\n${desc}\n#membres: ${membersCount}\n#administrateur(s): ${admins.join(' / ')}` +
        `\n\n[Voir notre chaîne : https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W/100 ]`;

      // Envoyer message avec mention
      await sock.sendMessage(id, {
        image: pfpUrl ? { url: pfpUrl } : undefined,
        caption: welcomeText,
        mentions: [participant, ...groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id)]
      });

    } catch (err) {
      console.error('Erreur dans welcome message:', err);
    }
  }
}

module.exports = { toggleWelcome, onGroupParticipantUpdate };
