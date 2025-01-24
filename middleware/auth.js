import jwt from 'jwt-simple'
import dayjs from 'dayjs'
import {secretaClave} from '../services/jwt.js' // importamos la clave secreta


// Funcion MIDDLEWARE de autenticacion
const auth = (req, res, next)=>{

    // Comprobamos si me llega la cabezera(headers) de Authenticacion
    if(!req.headers.authorization){
        return res.status(403).json({
            status : 'error',
            msj : 'La peticion no tiene la cabezera de autenticacion'
        })
    }

    // Limpiamos el token usando regular expression. Quitamos las comillas.
    let token = req.headers.authorization.replace( /['"]+/g, '' )

    try {

        let payload = jwt.decode(token, secretaClave)

        // Comprobamos la expiracion del token
        if(payload.exp <= dayjs().unix()){
            return res.status(401).json({
                status : 'error',
                msj : 'Token expirado...'
            })    
        }
        
        // Agregamos datos del usuario a request
        req.user = payload
        // console.log(payload)
        
    } catch (error) {
        return res.status(403).json({
            status : 'error',
            msj : 'Error en la autenticacion...'
        })
    }


    next()
}

export {
    auth
}
