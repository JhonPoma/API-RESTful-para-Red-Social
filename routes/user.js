import express, { Router } from 'express'
import {pruebaUser, getAllUsers, register, login, perfilUsuario, list, update, upload} from '../controllers/user.js'
import {auth} from '../middleware/auth.js'
import {uploads} from '../middleware/fileUpload.js'

const router = express.Router()

// Definimos las rutas
router.get('/prueba-usuario', auth, pruebaUser)
router.get('/getAllUsers', getAllUsers)
router.post('/register', register)
router.post('/login', login)
router.get('/perfil/:iD', auth, perfilUsuario)
router.get('/listado/:page?', auth, list)
router.put('/update/',auth, update) // Ya no sera necesario mandarle el ID ( /:id ), para eso nos autenticamos
                                    // y al autenticarnos el mismo usuario es el que puede actualizarse.
router.post('/upload', [auth, uploads.single('file0')], upload)

export default router