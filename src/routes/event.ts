import express from "express"
import {
  createEvent,
  findById,
  updateEvent,
  fetchEventList,
  cancelEvent,
} from "../controller/event/eventController"

import selectUserModel from "../middleware/selectUser"

const router = express.Router()

router.get("/findById/:id", findById)

router.post("/create", selectUserModel, createEvent)

router.put("/update/:id", updateEvent)

router.put("/cancel/:id", cancelEvent)

router.get("/fetchEventList", selectUserModel, fetchEventList)

export default router
