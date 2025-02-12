import {Follow} from '../models/follow.js'
import {User} from '../models/user.js'

const pruebaFollow = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/follow.js"
    })
}


// Accion de guardar un follow (accion de seguir)
const guardar = async (req, res)=>{
    // Sacamos ID del usuario identificado
    const idUsuarioIdentificado = req.userAuth.id
    // Obtenemos datos del body
    const request = req.body

    // Validamos que el campo "siguiendoA" esté presente
    if (!request.siguiendoA) {
        return res.status(400).json({
            status: "error",
            msj: "No se ha especificado el usuario a seguir.",
        });
    }

    // Creamos un objeto con modelo follow
    let userToFollow = new Follow({
        user : idUsuarioIdentificado,
        followed : request.siguiendoA
    })

    // Guardamos el objeto en la bbdd
    try {
        const followAlmacenado = await userToFollow.save()
        // console.log(followAlmacenado)
        return res.status(200).json({
            status : "success",
            msj : "Siguiendo al usuario...",
            identidad : req.userAuth,
            idUserIdentificado : idUsuarioIdentificado,
            siguiendoUsuario : request,
            followAlmacenado
        })
    } catch (error ) {
        return res.status(500).json({
            status : 'error',
            msj : "No se ha podido seguir al usuario",
            error : error.mesage || error
        })
    }

}

export  {
    pruebaFollow,
    guardar
}