import fetch from 'node-fetch';
import fs from 'fs';  // Asegúrate de importar 'fs'
import path from 'path'; // Asegúrate de importar 'path'
let handler = async function (m, { conn, text, usedPrefix }) {
  // Función para verificar si el número de tarjeta es válido usando el algoritmo de Luhn
  function checkLuhn(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    // Recorremos el número de la tarjeta desde el final
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Función para generar el número de tarjeta
  function generateCardNumber(bin) {
    let cardNumber = bin;

    // Si el BIN tiene menos de 6 dígitos, completamos con 'x' hasta 6 dígitos
    cardNumber = cardNumber.padEnd(6, 'x');  // Aseguramos que al menos tenga 6 dígitos

    // Reemplazamos las "x" por números aleatorios
    cardNumber = cardNumber.replace(/x/g, () => Math.floor(Math.random() * 10));

    // Validamos que el número generado sea válido con el algoritmo de Luhn
    if (!checkLuhn(cardNumber)) {
      return generateCardNumber(bin);  // Si no es válido, generamos otro número
    }

    return cardNumber;
  }

  // Función para generar un CVV aleatorio
  function generateCVV() {
    return Math.floor(100 + Math.random() * 900);  // Generamos un CVV entre 100 y 999
  }

  // Extraemos el BIN, mes, año y CVV del input
  let input = text.split('|');
  if (input.length < 4) {
    return conn.reply(m.chat, 'Por favor, ingresa los datos en el formato correcto: BIN|MM|AAAA|CVV', m);
  }

  let bin = input[0].replace(/[^0-9x]/g, '');  // Quitamos caracteres no numéricos ni "x"
  let mes = input[1];
  let ano = input[2];
  let cvv = input[3];

  // Generamos las tarjetas
  let tarjetasGeneradas = [];
  let cantidadTarjetas = 7;  // Generamos 7 tarjetas por defecto

  // Generar tarjetas 
  for (let i = 0; i < cantidadTarjetas; i++) {
    // Generamos el número de tarjeta usando el BIN
    let generatedCardNumber = generateCardNumber(bin);  // Generamos el número de tarjeta
    
    // Generamos un CVV aleatorio 
    let generatedCvv = (cvv === 'rnd' || cvv === 'xxx' || cvv === '') ? generateCVV() : cvv;

    // Generar la fecha de vencimiento
    let expirationDate = `${mes.padStart(2, '0')}/${ano.slice(-2)}`;

    // Preparar la tarjeta generada
    let tarjetaGenerada = `${generatedCardNumber}|${expirationDate}|${generatedCvv}`;

    // Almacenamos la tarjeta generada
    tarjetasGeneradas.push(tarjetaGenerada);
  }

  // Llamar a la API de BIN para obtener detalles del BIN
  const apiUrl = `https://bins.antipublic.cc/bins/${bin.slice(0, 6)}`;
  let binDetails = '';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Formateamos la información recibida de la API
    binDetails = `
  ╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸
  • *Info* » ${data.brand} - ${data.type} - ${data.level}
  • *Bank* » ${data.bank}
  • *Country* » ${data.country_name} (${data.country_flag})
    `;
  } catch (error) {
    binDetails = 'No se pudo obtener información adicional del BIN.';
  }

  // Unir las tarjetas generadas en un solo mensaje
  let tarjetaMensaje = tarjetasGeneradas.join('\n');

  // Mensaje a enviar con las tarjetas generadas y la información del BIN
  let playMessage = `[⚖️] Card Generator
╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸╸:\n${tarjetaMensaje}\n${binDetails}`;

  // Enviar el mensaje con la imagen y el texto (sin botones)
  await conn.sendMessage(m.chat, {
    text: playMessage.trim(),
    mentions: [...playMessage.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
    contextInfo: {
      forwardingScore: 9999999,
      isForwarded: true,
      mentionedJid: [...playMessage.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'),
      "externalAdReply": {
        "showAdAttribution": true,
        "containsAutoReply": true,
        "renderLargerThumbnail": true,
        "title": '乂 𝙷 𝙰 𝙲 𝙷 𝙸 𝙺 𝙾 - 𝙱 𝙾 𝚃 - 𝙼 𝙳 乂',
        "containsAutoReply": true,
        "mediaType": 1,
        "thumbnail": imagen7,  // La imagen que ya tienes definida
        "mediaUrl": yt,  // URL o fuente adicional de la imagen
        "sourceUrl": md  // La URL de la fuente
      }
    }
  });
};

handler.tags = ['bin'];
handler.help = ['gen'];
handler.command = /^(gen)$/i;

export default handler;
