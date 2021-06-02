import express from "express"
import { playerSignup, login } from "../controller/auth/authPlayer"
import {arenaSignup} from "../controller/auth/autharena"
const router = express.Router()

router.post("/playerSignup", playerSignup)

router.post("/arenaSignup", arenaSignup)

router.post("/playerLogin", login)

export default router
