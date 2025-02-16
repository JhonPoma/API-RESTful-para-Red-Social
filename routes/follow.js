import express from "express";
import {pruebaFollow,guardar, unfollow, following, followers} from '../controllers/follow.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.get('/prueba-follow', pruebaFollow)
router.post('/save', auth, guardar)
router.delete('/unfollow/:idFollowed',auth, unfollow)
router.get('/following/:id?/:page?',auth, following)
router.get('/followers/:id?/:page?', auth, followers)

export default router
