import express from "express"
import {
  createPEvent,
  deletePEvent,
  fetchPEventList,
} from "../controller/pEvent/pEventController"

const router = express.Router()

router.post("/create", createPEvent)

router.delete("/:id", deletePEvent)

router.get("/fetchEventList", fetchPEventList)

export default router
