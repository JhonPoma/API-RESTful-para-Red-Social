// Aqui manejamos la subida de archivos.

import multeR from 'multer'
import fs from 'fs'

const path = './upload/avatars'
if(!fs.existsSync(path)){
    fs.mkdirSync(path, {recursive:true})
}

// Configuracion de subida
const almacenamiento = multeR.diskStorage({

    destination : (req, file, cb)=>{
        cb(null, path)
    },
    filename : (req, file, cb)=>{
        cb(null, 'avatar-'+Date.now()+'-'+file.originalname )
    }

})

// Creamos un middleware para gestionar la subida de archivos
const uploads = multeR({storage: almacenamiento})

export {
    uploads
}
