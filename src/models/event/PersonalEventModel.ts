import { Schema, model } from "mongoose"
import { Event as CalenderEvent } from "react-big-calendar"

interface IPersonalEvent extends CalenderEvent {
  creator: string
  description?: string
}

const PersonalEventSchema = new Schema<IPersonalEvent>({
  creator: { type: String, required: true },
  description: String,
  title: { type: String, required: [true, "Title is required"] },
  start: { type: String, required: true },
  end: { type: String, required: true },
})

const PersonalEventModel = model<IPersonalEvent>(
  "PersonalEvent",
  PersonalEventSchema
)

export default PersonalEventModel
