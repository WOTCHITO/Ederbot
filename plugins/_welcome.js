import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true
  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https:                               

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, '//files.catbox.moe/xr2m6u.jpg';

  if (chat.welcome) {
    let img;
    try {
      let pp = await conn.profilePictureUrl(who, 'image');
      img = await (await fetch(pp)).buffer();
    } catch {
      img = await (await fetch(defaultImage)).buffer();
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `🌱 *Bienvenido* a ${groupMetadata.subject}\n ${taguser}\n SIGUE MI CANAL DONDE SUBO MODS TODO LOS DIAS🥰✨ https://whatsapp.com/channel/0029VaFMguNDTkJzaPGXAG3D!`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })
    }
  }
  return true
    }
