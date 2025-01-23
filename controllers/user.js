import  {User}  from '../models/user.js'

const pruebaUser = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/user.js"
    })
}



// Registro de usuarios
const register = (req, res)=>{

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
    User.find({
        $or : [
            {email : userToSave.email.toLowerCase() },
            {nick : userToSave.nick.toLowerCase() } 
        ]
    }).exec( (error, users) =>{
        if(error) return res.status(500).json({status:'error', msj:'error en la consulta'})
        
        if(users && users.length >= 1 ){
            return res.status(200).json({
                status : 'success',
                msj : 'El usuario ya existe..'
            })
        }
        // cifrar la contraseña

        // devolver resultados

        return res.status(200).json({
            status : 'success',
            msj : 'Metodo de registro de usuarios',
            userToSave
        })
    })


}

export {
    pruebaUser, register
}