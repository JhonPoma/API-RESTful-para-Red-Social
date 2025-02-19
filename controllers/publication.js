import {Publication} from '../models/publication.js'

const pruebaPublication = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/publication.js"
    })
}

// Guardar publicacion
const savePublication = async (req, res)=>{
    
    const userAutenticado = req.userAuth.id
    const datosBody = req.body.text
    const fileBody = req.body.file? req.body.file:"fileDefault" 

    if(!datosBody){
        return res.status(400).json({
            status : "error",
            msj : "Debes enviar un texto, no hay ninguna publicacion a guardar..."
        })
    }

    const nuevaPublicacion = new Publication({
        user : userAutenticado,
        text : datosBody,
        file : fileBody
    })

    try {
        const publicacionAlmacenada = await nuevaPublicacion.save()
    
        return res.status(200).json({
            status : "success",
            msj : "publicacion guardada",
            publicacionAlmacenada
        })
        
    } catch (error) {
        return res.status(400).json({
            status : "error",
            msj : "error al guardar la publicacion"
        })
    }
}

// Sacar una publicacion
const detailPublication = async (req,res)=>{

    const userAutenticado = req.userAuth.id
    const publicacionID = req.params.idPublication

    if(!publicacionID){
        return res.status(500).json({
            status : "error",
            msj : "Falta ID de la publicacion en la url"
        })
    }

    try {
        const publicacion = await Publication.findById(publicacionID).populate("user", "-_id -password -created_at -__v")
    
        return res.status(200).json({
            status : "success",
            msj : "Mostrando publicacion...",
            publicacion
        })
        
    } catch (error) {
        return res.status(500).json({
            status : "error",
            msj : "Error al mostrar la publicacion o ID no existe..."
        })
    }
}


export {
    pruebaPublication,
    savePublication,
    detailPublication
}