import express from "express"
import { playerSignup } from "../controller/auth/authPlayer"
import { arenaSignup } from "../controller/auth/authArena"
import { signin } from "../controller/auth/authSignin"
const router = express.Router()

router.post("/playerSignup", playerSignup)

router.post("/arenaSignup", arenaSignup)

router.post("/signin", signin)

export default router
