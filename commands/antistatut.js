//antistatut.js
// Stockage de l'état antistatut par groupe
if (!global.antistatutStatus) global.antistatutStatus = {};
// Stockage des avertissements par groupe et utilisateur
if (!global.antistatutWarnings) global.antistatutWarnings = {};

async function toggleAntiStatut(sock, jid, sender, command, admins) {
  if (!admins.includes(sender)) {
    await sock.sendMessage(jid, { text: 'Commande réservée aux administrateurs.' });
    return;
  }

  if (command === '!antistatuton') {
    global.antistatutStatus[jid] = true;
    await sock.sendMessage(jid, { text: 'Anti-statut activé ✅' });
  } else if (command === '!antistatutoff') {
    global.antistatutStatus[jid] = false;
    await sock.sendMessage(jid, { text: 'Anti-statut désactivé ❌' });
    if (global.antistatutWarnings[jid]) delete global.antistatutWarnings[jid];
  }
}

async function handleAntiStatut(sock, message) {
  const jid = message.key.remoteJid;
  if (!global.antistatutStatus[jid]) return;

  try {
    const sender = message.key.participant || message.key.remoteJid;

    // Vérifier si le message est un statut (dans Baileys, c'est dans message.status)
    // Ici on suppose que le statut est détecté par message.message?.statusBroadcast
    if (!message.message || !message.message.statusBroadcast) return;

    // Supprimer le statut ? Baileys ne permet pas directement de supprimer les statuts postés par d'autres, ceci est une limite.
    // On pourrait enregistrer leur ID et traiter selon.

    // Ici, on utilise une logique possible : avertir et suivre les avertissements

    if (!global.antistatutWarnings[jid]) global.antistatutWarnings[jid] = {};
    if (!global.antistatutWarnings[jid][sender]) global.antistatutWarnings[jid][sender] = 0;
    global.antistatutWarnings[jid][sender]++;

    const warns = global.antistatutWarnings[jid][sender];

    // Envoyer avertissement avec incrémentation
    await sock.sendMessage(jid, {
      text: `🄹🄴🄽🄸🄵🄴🅁🆇︎🅼︎
༺══━═━༻
*𒁂𒋲𓊈𝘼𝙇𝙀𝙍𝙏𝙀🚨𓊉꧁𓆩࿋𓆪𝙎𝙏𝘼𝙏𝙐𝙏𝙎 𝘿𝙀𝙏𝙀𝘾𝙏é𝙎𒋲𒁂*  
༺══━═━༻✦༺━═━══༻  
𝘼𝙣𝙩𝙞-𝙎𝙩𝙖𝙩𝙪𝙩𝙨 𝙤𝙣 
༺══━═━༻✦༺━═━══༻
𓊈𓆩𝙎𝙐𝙋𝙋𝙍𝙀𝙎𝙎𝙄𝙊𝙉 𝘼𝙐𝙏𝙊𝙈𝘼𝙏𝙄𝙌𝙐𝙀𓆪𓊉
> αdvєrtíssєmєnt :
> ${warns}/3`,
      mentions: [sender]
    });

    // Après 3 avertissements, exclure l'utilisateur
    if (warns >= 3) {
      await sock.groupParticipantsUpdate(jid, [sender], 'remove');
      await sock.sendMessage(jid, {
        text: `L'utilisateur @${sender.split('@')[0]} a été expulsé pour publication répétée de statuts.`,
        mentions: [sender]
      });
      delete global.antistatutWarnings[jid][sender];
    }

  } catch (error) {
    console.error('Erreur antistatut:', error);
  }
}

module.exports = { toggleAntiStatut, handleAntiStatut };
