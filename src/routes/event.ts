import express from "express"
import { createEvent, findById } from "../controller/event/eventController"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", createEvent)

export default router
