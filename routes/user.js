import express from 'express'
import {pruebaUser} from '../controllers/user.js'

const router = express.Router()

// Definimos las rutas
router.get('/prueba-usuario', pruebaUser)



export default router