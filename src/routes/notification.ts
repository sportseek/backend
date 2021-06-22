import express from "express"
import { getNotifications } from "../controller/notification/notificationController"

const router = express.Router()

router.get("/getNotifications/:pageNumber", getNotifications)

export default router