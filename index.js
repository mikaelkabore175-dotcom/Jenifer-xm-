const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// Charger toutes les commandes depuis le dossier "commands"
const commands = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  Object.assign(commands, command);
}

// Helper pour récupérer les admins d’un groupe
async function getGroupAdmins(sock, jid) {
  const metadata = await sock.groupMetadata(jid);
  return metadata.participants.filter(p => p.admin !== null).map(p => p.id);
}

// Démarrer le bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(path.resolve('./auth'));
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('📲 Scanne ce QR code avec WhatsApp pour connecter le bot');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log('❌ Connexion fermée', 'Reconnect ? ', shouldReconnect);
      if (shouldReconnect) startBot();
    }

    if (connection === 'open') {
      console.log('✅ Connecté à WhatsApp !');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Écouter les nouveaux messages
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || jid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    try {
      // Récupérer la liste des admins si groupe
      let admins = [];
      if (jid.endsWith('@g.us')) {
        admins = await getGroupAdmins(sock, jid);
      }

      // Exemple simple de déclenchement commande selon message
      if (text.startsWith('!')) {
        const cmdName = text.slice(1).split(' ')[0].toLowerCase();

        if (commands[cmdName]) {
          // Appeler la commande avec les paramètres nécessaires
          await commands[cmdName](sock, jid, msg, sender, admins);
        }
      } else {
        // Gestion d'autres cas (par ex: autojoin au jeu, autoreact, suicide, etc.)
        // Exemples d'appels (adapter selon implémentation des commandes) :
        if (text.toLowerCase() === '<y>' && commands.joinGame) {
          await commands.joinGame(sock, jid, msg, text);
        }
        if ((text === '!autoreacton' || text === '<!autoreactoff>') && commands.toggleAutoReact) {
          await commands.toggleAutoReact(sock, jid, sender, text, admins);
        }
        if (text === '<!stopautovustatut>' && commands.stopAutoViewStatus) {
          await commands.stopAutoViewStatus(sock);
        }
        if (text === '<!stopgame>' && commands.stopGame) {
          await commands.stopGame(sock, jid, sender);
        }
        // etc.
      }
    } catch (e) {
      console.error('Erreur lors du traitement du message:', e);
    }
  });
}

startBot();
