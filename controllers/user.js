import  {User}  from '../models/user.js'
import bcrypt from 'bcrypt'

const pruebaUser = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/user.js"
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

export {
    pruebaUser, getAllUsers, register
}