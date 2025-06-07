import axios from 'axios';

let handler = async (m, { args, conn }) => {
    if (!args[0]) {
        return conn.reply(m.chat, '⚠️ Por favor ingresa un número de DNI válido', m);
    }

    const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODc1OCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.0ed6VqQzrDKDexyrRAWvd2gdexoHqD7mmQcPSAGzNQ4";
    const BASE_URL = "https://api.factiliza.com/v1";
    const dni = args[0].trim();

    try {
        const response = await axios.get(`${BASE_URL}/dni/info/${dni}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        const data = response.data;
        
        if (data.success) {
            const info = data.data;
            let message = `
*🔍 Resultados de Consulta DNI ${dni}:*

📌 *Nombre Completo:* ${info.nombre_completo}
📍 *Ubicación:*
   - Departamento: ${info.departamento}
   - Provincia: ${info.provincia}
   - Distrito: ${info.distrito}
   - Dirección: ${info.direccion_completa}


            `;
            await conn.reply(m.chat, message, m);
        } else {
            await conn.reply(m.chat, `❌ Error en la consulta: ${data.message || "DNI no encontrado o error en el servidor"}`, m);
        }
    } catch (error) {
        console.error('Error en consulta DNI:', error);
        let errorMessage = '⚠️ Ocurrió un error al conectar con el servicio de consulta.';
        
        if (error.response) {
            // Error de respuesta HTTP (4xx, 5xx)
            errorMessage += `\nCódigo: ${error.response.status}`;
            if (error.response.data && error.response.data.message) {
                errorMessage += `\nMensaje: ${error.response.data.message}`;
            }
        } else if (error.request) {
            // La solicitud fue hecha pero no hubo respuesta
            errorMessage += '\nEl servidor no respondió';
        }
        
        await conn.reply(m.chat, errorMessage, m);
    }
}

handler.help = ['dni <número>'];
handler.tags = ['herramientas'];
handler.command = ['dni', 'consultadni'];
export default handler;
