import jwt from 'jwt-simple'
import moment from 'moment'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
dotenv.config() // Cargamos el archivo .env


// Clave secreta para generar el Token (necesario para codificar y decodificar el token)
const secretaClave = process.env.SECRET_KEY_TOKEN

// Creamos una funcion para generar Tokens, datos del usuario (PAYLOAD)
const crearToken = ( usuarioT )=>{
    const payload = {
        id : usuarioT._id,
        name : usuarioT.name,
        nick : usuarioT.surname,
        email : usuarioT.email,
        role : usuarioT.role,
        image : usuarioT.image,
        iat : dayjs().unix(),
        exp : dayjs().add(30,'days').unix()
    }

    // Devolver jwt token codificado
    return jwt.encode(payload, secretaClave)
}

export {
    crearToken
}

