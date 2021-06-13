import express from "express"
import { createEvent, findById, updateEvent, getArenaEvents } from "../controller/event/eventController"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", createEvent)

router.put("/update/:id", updateEvent)

router.get("/getArenaEvents", getArenaEvents)

export default router
