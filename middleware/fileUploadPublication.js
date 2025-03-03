import multerxd from 'multer'
import fs from 'fs'

const path = './upload/publications'

if(!fs.existsSync(path)){
    fs.mkdirSync(path, {recursive:true})
}

const almacenamiento = multerxd.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, "pub-"+Date.now()+"-"+file.originalname)
    }
})

const uploadPub = multerxd({storage : almacenamiento})

export {
    uploadPub
}