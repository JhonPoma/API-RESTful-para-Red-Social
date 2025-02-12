import express from "express";
import {pruebaFollow,guardar} from '../controllers/follow.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/prueba-follow', pruebaFollow)
router.post('/save', auth, guardar)

export default router
