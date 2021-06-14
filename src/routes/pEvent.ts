import express from "express"
import {
  createEvent,
  findById,
  updateEvent,
  fetchEventList,
  cancelEvent,
} from "../controller/event/eventController"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", createEvent)

router.put("/update/:id", updateEvent)

router.put("/cancel/:id", cancelEvent)

router.get("/fetchEventList", fetchEventList)

export default router
