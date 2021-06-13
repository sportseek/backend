import express from "express"
import { createEvent, findById, updateEvent, getArenaEvents, cancelEvent } from "../controller/event/eventController"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", createEvent)

router.put("/update/:id", updateEvent)

router.put("/cancel/:id", cancelEvent)

router.get("/getArenaEvents", getArenaEvents)

export default router
