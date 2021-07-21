import { Schema, model } from "mongoose"

interface INotification {
  creatorId: string
  creatorName: string
  receiverId: string
  receiverName: string
  type: string
  description: string
  createdAt: Date
  unreadStatus: boolean
  eventId: string
}

const NotificationSchema = new Schema<INotification>({
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  receiverId: { type: String, required: true },
  receiverName: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true },
  unreadStatus: { type: Boolean, required: true },
  eventId: { type: String, required: true },
})

const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema
)

export default NotificationModel
