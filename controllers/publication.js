// Importamos Modelos
import {Publication} from '../models/publication.js'
import {followUserIds} from '../services/followService.js'

// Importamos modulos
import fs from 'fs'
import path from 'path'
import mongosePagess from 'mongoose-pagination'
import mongoosePaginate from 'mongoose-paginate-v2'

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

// Eliminar publicacion
const deletePublication = async (req,res)=>{

    const userAutenticado = req.userAuth.id
    const publicacionID = req.params.idPublication
    if(!publicacionID){
        return res.status(500).json({
            status : "error",
            msj : "Falta ID de la publicacion en la url"
        })
    }

    try {
        // Solo puede eliminar la publicacion el usuario quien lo creo
        const publicationEliminando = await Publication.deleteOne({
            user : userAutenticado,
            _id : publicacionID
        })

        if(publicationEliminando.deletedCount == 0){
            return res.status(200).json({
                status : "success",
                msj : "Publicacion ya fue eliminado...",
            })
        }

        return res.status(200).json({
            status : "success",
            msj : "Publicacion eliminada...",
            publicationEliminando
        })

    } catch (error) {
        return res.status(500).json({
            status : "error",
            msj : "Error al eliminar o ID no existe o No puedes eliminar esta publicacion...",
        })
    }
}

// Listar publicaciones de un usuario
const listPublicationUser = async(req,res)=>{

    const userAutenticado = req.userAuth.id
    const paramsId = req.params.id

    try {
        const findPublication = await Publication.find({
            user : paramsId
    
        }).sort("-created_at")
        .select("-_id -created_at -__v")
        .populate("user","-surname -nick -email -password -role -image -created_at -__v")        
        
        if(findPublication.length<=0){
            return res.status(200).json({
                status : "success",
                msj : "Este usuario no tiene publicaciones"
            })    
        }
        
        return res.status(200).json({
            status : "success",
            msj : "correcto",
            userAutenticado,
            findPublication
        })

    } catch (error) {
        return res.status(500).json({
            status : "error",
            error
        })
    }
}

// Subir ficheros
const uploadFiles = async(req, res)=>{
    
    const userAutenticado = req.userAuth.id
    const idPublication = req.params.id     // sacamos el id de la pub que queremos subir file.

    //Recogemos el fichero de imagen y comprobamos que existe
    if(!req.file){
        return res.status(404).json({
            status : 'error',
            mjs : 'peticion no incluye la imagen'
        })
    }
    console.log(req.file)

    // Obtenemos el nombre del archivo
    let nameImage = req.file.originalname;

    // Sacamos la extension del archivo (jpg, png, jpeg, gif)
    const imageSplit = nameImage.split("\.")
    const extensionImage = imageSplit[1]


    // Comprobamos la extension
    if(extensionImage != 'png' && extensionImage != 'jpg' && extensionImage != 'jpeg' && extensionImage != 'gif' ){
        // si no es ningun de estos tipos, lo elimamos
        const filePath = req.file.path
        const fileDeleted = fs.unlinkSync(filePath)

        return res.status(400).json({
            status : 'error',
            msj : 'Extension del fichero invalido...'
        })
    }

    // Si es correcto la extension, guardamos la imagen en la bbdd
    try {
        const actualizaImage = await Publication.findOneAndUpdate(
            { user:userAutenticado, _id:idPublication}, // buscamos a quien vamos a actualizar
            { file : req.file.filename},                // campo que actualizaremos de nuestro modelo.
            { new:true}                                 // me devulve los datos actualizados, si pongo false me devuelve el doc antes de la actualiza.
        )
        
        return res.status(200).json({
            status : 'success',
            msj :'Subida de imagenes...',
            userAutenticado,
            idPublication,
            usuario : actualizaImage,
            file : req.file,
        })

    } catch (error) {
            return res.status(500).json({
            status : 'error',
            msj :'Error en la subida del avatar...',

            
        })
    }
}

// Devolvemos archivos multimedias (imagenes,..)
const media = (req,res)=>{

    // sacamos el parametro de la url
    const nameMedia = req.params.fileX

    // el path real de la imagen
    const filePath = './upload/publications/'+nameMedia

    // comprobar que existe esa image en la ruta
    fs.stat(filePath, (error, existe)=>{
        if(!existe){
            return res.status(404).send({
                status : "error",
                msj : 'no existe la imagen...',
            })
        }
        return res.sendFile(path.resolve(filePath))
    })
}

// Listar todas las publicaciones de los usuarios que SEGUIMOS (feed)
const feed = async(req, res)=>{

    const userAutenticado = req.userAuth.id
    const paginaUrl = req.params.page

    let pagina = 1
    if(paginaUrl) pagina=paginaUrl
    pagina = parseInt(pagina)
    
    let itemPorPagina = 3
    
    try {
        
        // Sacamos un array de identificadores de users que YO SIGO como user autenticado. Usamos el servicio - followService
        const myFollowing = await followUserIds(userAutenticado)
        
        // Obtenemos el total de publicaciones (sin paginar)
        const totalPublicacionesEncontradas = await Publication.countDocuments({
            user: { $in: myFollowing.followingID }  // Usamos el operador $in para buscar coincidencias dentro de un array. 
                                                    // Compara el valor de "user" con todos los elementos de "followingID" y devuelve
                                                    // los documentos cuyo campo "user" coincida con **al menos uno** de esos elementos.
                                                    // Pudimos haber usado de manera implicita  = user:myFollowing.followingID
        });

        const publications = await Publication.find({
            user: { $in: myFollowing.followingID }
        }).sort("-created_at")
        .select("-_id -created_at -__v")
        .populate("user", "-__v -password -email")
        .paginate(pagina, itemPorPagina )
        
        if(!totalPublicacionesEncontradas || !publications || totalPublicacionesEncontradas.length===0){
            return res.status(200).json({
                status : "success",
                msj : "No hay publicaciones para mostrar, vacio"
            })
        }
        const totalPublicacionesEncontradasxPagina = publications.length    // sabemos que x defecto sera 3, pero en la ultima pagina disminuira
        
        return res.status(200).send({
            status : "success",
            msj : 'mostrando las publicaciones de los que YO sigo',
            following : myFollowing.followingID,
            publications,
            paginaURL : pagina,
            totalPublicaciones : totalPublicacionesEncontradas,
            totalPublicacionesHere : totalPublicacionesEncontradasxPagina,
            totalPaginas : Math.ceil(totalPublicacionesEncontradas/itemPorPagina)
        })

    } catch (error) {
        return res.status(500).send({
            status : "error",
            msj : "Hubo un error al obtener las publicaciones",
            error : error.message || error
        })
    }
}


export {
    pruebaPublication,
    savePublication,
    detailPublication,
    deletePublication,
    listPublicationUser,
    uploadFiles,
    media,
    feed
}