
import express from "express";
import {pruebaPublication, savePublication, detailPublication } from '../controllers/publication.js'
import {auth} from '../middleware/auth.js'


const router = express.Router()

// Definimos la ruta
router.get('/prueba-publicacion',pruebaPublication)

router.post('/savePublication', auth, savePublication)
router.get('/detailPublication/:idPublication?', auth, detailPublication)

export default router
