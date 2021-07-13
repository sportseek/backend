import express from "express"
import {
  getNotifications,
  readNotification,
} from "../controller/notification/notificationController"

const router = express.Router()

router.get("/getNotifications/:pageNumber", getNotifications)

router.post("/readNotification", readNotification)

export default router
