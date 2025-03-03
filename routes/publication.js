
import express from "express";
import {pruebaPublication, savePublication, detailPublication, deletePublication, listPublicationUser, uploadFiles } from '../controllers/publication.js'
import {auth} from '../middleware/auth.js'
import {uploadPub} from '../middleware/fileUploadPublication.js'

const router = express.Router()

// Definimos la ruta
router.get('/prueba-publicacion',pruebaPublication)

router.post('/savePublication', auth, savePublication)
router.get('/detailPublication/:idPublication?', auth, detailPublication)
router.delete('/deletePublication/:idPublication?', auth, deletePublication)
router.get('/listPubUser/:id', auth, listPublicationUser)
router.post('/uploadFiles/:id', [auth, uploadPub.single('fileXD')], uploadFiles )

export default router
