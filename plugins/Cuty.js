sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return;

  for (const msg of messages) {
    if (!msg.message || !msg.message.conversation) continue;

    const text = msg.message.conversation.trim();

    // Verifica si el mensaje empieza con .cuty
    if (text.startsWith('.cuty')) {
      const cutyLinks = text.match(/https?:\/\/cuty\.io\/[a-zA-Z0-9]+/g);

      if (cutyLinks) {
        for (let shortUrl of cutyLinks) {
          const resolved = await resolveCutyLink(shortUrl);
          await sock.sendMessage(msg.key.remoteJid, {
            text: `Enlace original de ${shortUrl}:\n${resolved}`
          });
        }
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          text: 'No encontré ningún enlace de cuty.io en el mensaje.'
        });
      }
    }
  }
});
