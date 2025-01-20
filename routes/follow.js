import express from "express";
import {pruebaFollow} from '../controllers/follow.js'

const router = express.Router()

router.get('/prueba-follow', pruebaFollow)


export default router
