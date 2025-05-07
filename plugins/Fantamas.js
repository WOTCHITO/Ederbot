const fantasmas = {};

const handler = async (m, { conn, participants }) => {
  if (m.text !== '.eliminafantasmas') return;

  const grupo = m.chat.id;
  const tiempo = 50 * 1000; // 50 segundos
  const cooldown = handler.cooldown || {};

  if (cooldown[grupo] && cooldown[grupo] + tiempo > Date.now()) {
    const tiempoRestante = Math.ceil((cooldown[grupo] + tiempo - Date.now()) / 1000);
    m.reply(`Debes esperar ${tiempoRestante} segundos para volver a ejecutar este comando.`);
    return;
  }

  cooldown[grupo] = Date.now();
  handler.cooldown = cooldown;

  fantasmas[grupo] = participants.filter((participant) => participant.messages === 0).map((participant) => participant.id);

  if (fantasmas[grupo].length === 0) {
    m.reply('No hay fantasmas en este grupo.');
    return;
  }

  const mensaje = `Fantasmas detectados:\n\n${fantasmas[grupo].map((id) => `@${id.split('@')[0]}`).join('\n')}\n\nEscribe algo para dejar de ser un fantasma.`;

  for (const fantasma of fantasmas[grupo]) {
    await conn.sendMessage(grupo, { text: `@${fantasma.split('@')[0]} escribe algo para dejar de ser un fantasma.`, mentions: [fantasma] });
  }

  m.reply(mensaje);
};

handler.all = async (m, { conn }) => {
  if (!m.isGroup) return;
  const grupo = m.chat.id;
  if (fantasmas[grupo] && fantasmas[grupo].includes(m.sender)) {
    if (m.text && m.text.length > 0) {
      fantasmas[grupo] = fantasmas[grupo].filter((id) => id !== m.sender);
      await conn.sendMessage(grupo, { text: `@${m.sender.split('@')[0]} dejaste de ser un fantasma! Te salvaste de un kick.`, mentions: [m.sender] });
    }
  }
};

handler.help = ['eliminafantasmas'];
handler.tags = ['grupo'];
handler.command = ['eliminafantasmas'];
handler.group = true;

export default handler;
