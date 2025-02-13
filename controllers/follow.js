import {Follow} from '../models/follow.js'
import {User} from '../models/user.js'

const pruebaFollow = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/follow.js"
    })
}


// ACCION DE GUARDAR UN FOLLOW (accion de seguir)
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

// ACCION DE BORRAR UN FOLLOW (accion de dejar de seguir)
const unfollow =  async (req, res)=>{

    const userID = req.userAuth.id
    const followedID = req.params.idFollowed

    try {
        // DELETE FROM follows WHERE user='userID' AND followed = 'followedID';
       const followAlmacenado = await Follow.deleteMany({
        "user" : userID,
        "followed" : followedID 
       })
       if(followAlmacenado.deletedCount == 0){
        return res.status(404).json({
            status : 'error',
            msj : "No se encontró coincidencia para eliminar..."
        })
       }

        return res.status(200).json({
            status : 'success',
            msj : "Follow eliminado correctamente",
            userID,
            followAlmacenado : followAlmacenado
        })
        
    } catch (error) {
        return res.status(500).json({
            status : 'error',
            msj : "No has dejado de seguir a nadie...",
        })
    }



}



export  {
    pruebaFollow,
    guardar,
    unfollow
}