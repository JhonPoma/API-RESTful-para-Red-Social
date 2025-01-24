import express, { Router } from 'express'
import {pruebaUser, getAllUsers, register, login, perfilUsuario} from '../controllers/user.js'
import {auth} from '../middleware/auth.js'

const router = express.Router()

// Definimos las rutas
router.get('/prueba-usuario', auth, pruebaUser)
router.get('/getAllUsers', getAllUsers)
router.post('/register', register)
router.post('/login', login)
router.get('/perfil/:iD', auth, perfilUsuario)


export default router