import express from "express"
import { signup, login } from "../controller/auth/auth"

const router = express.Router()

router.post("/playerSignup", signup)

router.post("/playerLogin", login)

export default router
