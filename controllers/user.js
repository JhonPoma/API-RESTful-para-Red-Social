import  {User}  from '../models/user.js'
import bcrypt from 'bcrypt'
import {crearToken} from '../services/jwt.js'
import mongosePagess from 'mongoose-pagination'
import fs from 'fs'
import path from 'path'
import {followUserIds, followThisUser} from '../services/followService.js'

const pruebaUser = (req, res)=>{
    const nombre = req.userAuth.name    // Esto lo definimos en el auth.js, req.userAuth = payload
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


const perfilUsuario = async (req, res)=>{

    const idUser = req.params.iD
    try {
        const usuario = await User.findById( idUser ).select( {password:0, role:0})
        
        // Informacion de quien me sigue y a quien sigo.
        const followInfo = await followThisUser(req.userAuth.id, idUser)

        return res.status(200).json({
            status : 'success',
            msj : 'Usuario con ID...',
            user : usuario,
            following : followInfo.following,
            follower : followInfo.follower
        })
        
    } catch (error) {
        return res.status(500).json({
            status : 'error',
            msj : 'El usuario con ese ID no existe...'
        })
    }
}


// Usaremos pagination de mongoose
const list = async (req, res)=>{

    // Controlar en que pagina estamos
    let paginaActual = 1
    if(req.params.page){
        paginaActual = req.params.page
    }
    paginaActual = parseInt(paginaActual)

    // Consultar con mongoose paginate
    let itemsPorPagina = 5
    try {
        const totalUsuarios = await User.countDocuments()
        const usuarios = await User.find().sort('_id').paginate(paginaActual, itemsPorPagina)
        const usuariosEnEstaPagina = usuarios.length

        // Mostramos tambien mis seguidores y a los que sigo
        let idMyFollowing = await followUserIds(req.userAuth.id)

        return res.status(200).json({
            status : 'success',
            msj :  'sss...',
            userr : usuarios,
            usuariosEnEstaPagina,
            itemsPorPagina,
            paginaActual,
            totalUsuarios : totalUsuarios,
            totalPaginas: Math.ceil(totalUsuarios/itemsPorPagina),

            userFollowing : idMyFollowing.followingID,
            userFollow_me : idMyFollowing.followersID
        })

    } catch (error) {
        return res.status(404).json({
            status : 'error',
            msj :'Error en la consulta...',
            erro : error
        })
    }
}

const update = async (req, res)=>{

    // recogemos info del usuario a actualizar
    let userIndentificado = req.userAuth             //Esto lo definimos en el auth.js, req.userAuth = payload
    let userToUpdate = req.body

    delete req.userAuth.iat
    delete req.userAuth.exp
    delete req.userAuth.role
    delete req.userAuth.image

    // comprobar si el usuario ya existe, puede que al modificar insertemos un gmail o nick  
    // ya existente, eso debemos evitar.
    try {
        const usuarioFind = await User.find({
            $or : [
                { email : userToUpdate.email },
                { nick : userToUpdate.nick }
            ]            
        })

        let isEmailNickTaken = false
        usuarioFind.forEach( element => {

            // verificamos si el Email o Nick que quiero actualizar ya está en uso por otro usuario, 
            // pero excluyendo al usuario actual de esta verificación
            if(element && element._id != userIndentificado.id){ 
                isEmailNickTaken = true
            }            
        });
      
        if ( isEmailNickTaken ){
            return res.status(200).json({
                status : 'success',
                msj : 'El usuario con ese Email o Nick ya existe...'
            })
        }

        // Si en body enviamos que queremos actualizar el password
        if(userToUpdate.password){
            const hashearPassword = await bcrypt.hash(userToUpdate.password, 10)
            userToUpdate.password = hashearPassword
        }

        // actualizamos
        const usuarioActualizado = await User.findByIdAndUpdate({_id:userIndentificado.id}, userToUpdate,{new:true} )
        
        return res.status(200).json({
            status : 'success',
            msj :'Metodo de actualizaar usuario...',
            user : usuarioActualizado
    
        })

    } catch (error) {
                
        return res.status(500).json({
            status : 'error',
            msj :'Error para actualizar',
    
        })
    }  
}

const upload = async (req, res)=>{

    // Recoger el fichero de imagen y comprobar que existe
    if(!req.file){
        return res.status(404).json({
            status : 'error',
            msj : 'La peticion no incluye la imagen...',
        })
    }
    // consiguir el nombre del archivo
    let imageName = req.file.originalname

    // sacamos la extension del archivo
    const imagenSplit = imageName.split('\.') // tendre una array
    const extension = imagenSplit[1]

    // Comprobamos la extension
    if(extension!='png' && extension!='jpg' && extension!='jpeg' && extension!='gif'){
        const filepath = req.file.path
        const fileDeteled =  fs.unlinkSync(filepath)
        return res.status(404).json({
            status : 'error',
            msj : 'Extension del fichero invalida',
        })
    }   
    
    // Si es correcto , guardamos la imagen en la bbdd.
    try {
        const actualizaImage = await User.findOneAndUpdate({_id:req.userAuth.id}, {image : req.file.filename}, {new:true})
        return res.status(200).json({
            status : 'success',
            msj :'Subida de imagenes...',
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


const avatar = (req,res)=>{

    // cacamos el parametro de la url
    const nameAvatar = req.params.file

    // el path real de la imagen
    const filePath = './upload/avatars/'+nameAvatar

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

export {
    pruebaUser, 
    getAllUsers, 
    register,
    login,
    perfilUsuario,
    list,
    update,
    upload,
    avatar
}