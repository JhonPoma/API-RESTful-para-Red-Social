import  {User}  from '../models/user.js'
import bcrypt from 'bcrypt'
import {crearToken} from '../services/jwt.js'

const pruebaUser = (req, res)=>{
    const nombre = req.user.name    // Esto lo definimos en el auth.js, req.user = payload
    console.log(nombre)
    return res.status(200).send({
        mesage:"msj enviado desde controlador/user.js",
        nombreusuario : nombre
    })
}
const getAllUsers = async (req, res)=>{

    try {
        const usuarios = await User.find()

        return res.status(200).json({
            status : 'success',
            msj : 'Mostrando todos los usuario de la BD',
            usuario : usuarios
        })

        
    } catch (error) {
        return res.status(500).json({
            status : 'errorr',
            msj : 'no pude traer todos los usuarios'
        })
    }

}



// Registro de usuarios
const register = async (req, res)=>{

    // Recogemos datos de la peticion
    let parametros = req.body
    
    // Comprobamos que me llegen los datos
    if(!parametros.name || !parametros.nick || !parametros.email || !parametros.password ){
        return res.status(400).json({
            status : 'error',
            msj : 'Faltan datos requeridos por enviar'
        })
        
    }
    // creamos un objeto de usuarios
    let userToSave = new User(parametros)

    // control usuarios duplicados (email y nick)
    try {
        const usuarios = await User.find({
            // $or : [
            //     {email : userToSave.email.toLowerCase() },
            //     {nick : userToSave.nick.toLowerCase()}
            // ]
            $or : [
                {email : userToSave.email },
                {nick : userToSave.nick}
             
            ]
        })


        if(usuarios && usuarios.length >=1 ){
            return res.status(200).json({
                status : 'success',
                msj : 'El usuario ya existe..'
            })
        }


        // ciframos la contraseña
        const hashPassword = await bcrypt.hash(userToSave.password, 10)
        userToSave.password = hashPassword
        
        // Guardamos el usuario en la BBDD.
        const newUserCifrado = new User(userToSave);
        await newUserCifrado.save();  // guardamos a la BD mongo
        
        // devolver resultados
        return res.status(200).json({
            status : 'success',
            msj : 'Usuario registrado correctamente',
            user : newUserCifrado
        })

    } catch (error) {
        return res.status(500).json({
            status:'error', 
            msj:'error en la consulta'
        })
        
    }
}


const login = async (req,res)=>{

    // recogeremos parametros body
    const parametros = req.body

    if( !parametros.email || !parametros.password){
        return res.status(400).json({
            status : 'error',
            msj : 'Faltan datos, email o pass....'
        })
    }

    // Buscamos en la bbdd si existe
    try {
        const usuarioBD = await User.findOne({email : parametros.email})//.select({"password" : 0})   // Que no me devuelva el pass.

        if(!usuarioBD){
            return res.status(404).json({
                status : 'error',
                msj : 'Usuario no existe en la BD'
            })
        }

        // Comprobamos la pass digitada con pass en la BD.
        const pwdCorroborada = bcrypt.compareSync(parametros.password, usuarioBD.password) // true o false
        if(!pwdCorroborada){
            return res.status(400).json({
                status : 'error',
                msj : 'Error, el password no coincide...'
            })
        }
        // Devolvemos un TOKEN
        const token = crearToken(usuarioBD)

        return res.status(200).json({
            status : 'success',
            msj : 'Login exitoso',
            usuario : {
                id : usuarioBD._id,
                name : usuarioBD.name,
                nick : usuarioBD.nick
            },
            token
        })

        
    } catch (error) {
        return res.status(500).json({
            status : 'error',
            msj : 'Error al hacer login...'
        })
    }




}


export {
    pruebaUser, 
    getAllUsers, 
    register,
    login
}