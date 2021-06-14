import express from "express"
import {
  createEvent,
  fetchEventList,
} from "../controller/pEvent/pEventController"

const router = express.Router()

router.post("/create", createEvent)

router.get("/fetchEventList", fetchEventList)

export default router
