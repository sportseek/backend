import express from "express"
import { createEvent } from "../controller/event/eventController"

const router = express.Router()

router.post("/create/", createEvent)

export default router
