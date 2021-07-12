import express, { Request, Response, NextFunction } from "express"
import selectController from "../middleware/selectUser"
import ArenaControllar from "../controller/user/Arena"

const router = express.Router()

router.get("/findById/:id", ArenaControllar.findById)

export default router
