import {Follow} from '../models/follow.js'
import {User} from '../models/user.js'
import mongosePagess from 'mongoose-pagination'
import {followUserIds} from '../services/followService.js'

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
            msj : "No has dejado de seguir a nadie..."
        })
    }



}

// LISTADO DE USUARIOS A LOS QUE ESTOY SIGUIENDO o UN UsuarioX A QUIENES EL SIGUE 
const following = async(req, res)=>{

    const userIdentificado = req.userAuth.id

    // Si quiero ver de un UsuarioX a quienes sigue, para ello enviamos por url el ID
    if(req.params.id) userIdentificado==req.params.id

    if(req.params.id.length < 3){
        req.params.page = req.params.id
    }
    let page = req.params.page ? parseInt(req.params.page) : 1
    const itemsPorPagina = 5

    try {
        const follows = await Follow.find({
            user : userIdentificado
        }).populate("user followed","-role -password -__v")
        .paginate(page, itemsPorPagina)

        const usuariosEnEstaPagina = follows.length
        const totalDeUser = await Follow.countDocuments()

        let idMyFollowing = await followUserIds(userIdentificado)

        return res.status(200).json({
            status : 'success',
            msj : "Exitoso",
            follows : follows,
            usuariosEnEstaPagina : usuariosEnEstaPagina,
            itemsPorPagina : itemsPorPagina,
            paginaActual : page,
            totalPaginas : Math.ceil(totalDeUser/itemsPorPagina),
            
            userFollowing : idMyFollowing.followingID,
            userFollow_me : idMyFollowing.followersID
        })

    } catch (error) {
        return res.status(500).json({
            status : 'error',
            msj : "Error al ver seguidores...",
            error
        })
    }
}

// LISTADO DE USUARIOS QUE SIGUEN A CUALQUIER OTRO USUARIO 
const followers = async(req,res)=>{

    const userIdentificado = req.userAuth.id

    // Si quiero ver de un UsuarioX a quienes sigue, para ello enviamos por url el ID
    if(req.params.id) userIdentificado==req.params.id

    if(req.params.id.length < 3){
        req.params.page = req.params.id
    }
    let page = req.params.page ? parseInt(req.params.page) : 1
    const itemsPorPagina = 5

    try {
        const follows = await Follow.find({
            followed : userIdentificado
        }).populate("user followed","-role -password -__v")
        .paginate(page, itemsPorPagina)

        const usuariosEnEstaPagina = follows.length
        const totalDeUser = await Follow.countDocuments()

        let idMyFollowing = await followUserIds(userIdentificado)

        return res.status(200).json({
            status : 'success',
            msj : "Exitoso",
            follows : follows,
            usuariosEnEstaPagina : usuariosEnEstaPagina,
            itemsPorPagina : itemsPorPagina,
            paginaActual : page,
            totalPaginas : Math.ceil(totalDeUser/itemsPorPagina),
            
            userFollowing : idMyFollowing.followingID,
            userFollow_me : idMyFollowing.followersID
        })

    } catch (error) {
        return res.status(500).json({
            status : 'error',
            msj : "Error al ver seguidores...",
            error
        })
    }

}


export  {
    pruebaFollow,
    guardar,
    unfollow,
    following,
    followers
}