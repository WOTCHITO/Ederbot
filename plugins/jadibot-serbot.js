const { join } = require('path')
const { Boom } = require('@hapi/boom')
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { createRequire } = require('module')
const { spawn } = require('child_process')
const fs = require('fs') // 👈 Asegúrate de tener esta línea
const { existsSync } = require('fs')

global.sessions = 'sessions'
// global.jadi = 'jadibot'
// global.rutaJadiBot = join(__dirname, `./${jadi}`) // Solo descomenta si usas jadibot

const conectarSerBot = async (socket, m, command, args, text, usedPrefix, commandDel, from) => {
  try {
    let methodCodeQR = /--qr/i.test(args[0])
    let methodCode = /--code/i.test(args[0])

    if (!methodCodeQR && !methodCode && !existsSync(`./${sessions}/creds.json`)) {
      methodCodeQR = true
    }

    const { state, saveCreds } = await useMultiFileAuthState(`./${sessions}`)
    const require = createRequire(import.meta.url)
    const argsRun = [
      '--session', sessions,
      ...(methodCodeQR ? ['--qr'] : []),
      ...(methodCode ? ['--code'] : [])
    ]

    const bot = spawn('node', ['jadibot/serbot.js', ...argsRun], {
      stdio: 'inherit',
      env: { ...process.env, ...state, saveCreds: JSON.stringify(saveCreds) }
    })

    bot.on('close', (code) => {
      console.log(`Subbot cerrado con código ${code}`)
    })

  } catch (e) {
    console.error('Error en conectarSerBot:', e)
  }
}

export default conectarSerBot
