import axios from 'axios'

let HS = async (m, { conn, text }) => {
if (!text)  return conn.reply(m.chat, `❀ Ingresa un link de twitter`, m)
    
try {
let api = await axios.get(`https://api.davidcyriltech.my.id/twitter?url=${text}`)
let json = await api.data
let { description, thumbnail, video_sd, video_hd, audio } = json
let HS =  `- *Descripcion :* ${description}`

await conn.sendFile(m.chat, video_hd, 'HasumiBotFreeCodes.mp4', HS, m)
} catch (error) {
console.error(error)    
}}

HS.command = ['twitter', 'twitterdl']

export default HS
