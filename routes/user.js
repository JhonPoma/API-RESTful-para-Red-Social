import express, { Router } from 'express'
import {pruebaUser, register} from '../controllers/user.js'

const router = express.Router()

// Definimos las rutas
router.get('/prueba-usuario', pruebaUser)
router.post('/register', register)


export default router