import express from "express"
import {
  createEvent,
  findById,
  updateEvent,
  fetchEventList,
  cancelEvent,
  fetchAllEvents,
  updateInterested,
  updateRegistered,
} from "../controller/event/eventController"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", createEvent)

router.put("/update/:id", updateEvent)

router.put("/cancel/:id", cancelEvent)

router.get("/fetchEventList", fetchEventList)

router.post("/fetchAllEvents", selectUserModel, fetchAllEvents)

router.put("/updateInterested/:id", updateInterested)

router.put("/updateRegistered/:id", updateRegistered)

export default router
