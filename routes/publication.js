
import express from "express";
import {pruebaPublication } from '../controllers/publication.js'

const router = express.Router()

// Definimos la ruta
router.get('/prueba-publicacion',pruebaPublication)


export default router
