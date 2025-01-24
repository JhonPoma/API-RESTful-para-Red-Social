import express, { Router } from 'express'
import {pruebaUser, getAllUsers, register, login} from '../controllers/user.js'

const router = express.Router()

// Definimos las rutas
router.get('/prueba-usuario', pruebaUser)
router.get('/getAllUsers', getAllUsers)
router.post('/register', register)
router.post('/login', login)


export default router