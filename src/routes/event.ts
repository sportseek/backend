import express from "express"
import {
  createEvent,
  findById,
  updateEvent,
  fetchEventList,
  cancelEvent,
  fetchAllEvents,
  updateInterested,
} from "../controller/event/eventController"

import selectUserModel from "../middleware/selectUser"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", selectUserModel, createEvent)

router.put("/update/:id", updateEvent)

router.put("/cancel/:id", cancelEvent)

router.get("/fetchEventList", selectUserModel, fetchEventList)

router.post("/fetchAllEvents", selectUserModel, fetchAllEvents)

router.put("/updateInterested/:id", updateInterested)

export default router
