async function sendPingCommand(sock, jid) {
  const response = `༒🤖𝙅𝙀𝙉𝙄𝙁𝙀𝙍 𝙓𝙈🤖༒\npong : ..`;
  await sock.sendMessage(jid, { text: response });
}

// Dans ton gestionnaire de commandes :
// if(command === 'ping'){
//   await sendPingCommand(sock, from);
// }

module.exports = { sendPingCommand };
