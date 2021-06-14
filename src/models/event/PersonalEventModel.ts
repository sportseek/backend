import { Schema, model } from "mongoose"
import { Event as CalenderEvent } from "react-big-calendar"

interface IPersonalEvent extends CalenderEvent {
    creator: string
    description?: string
}

const PersonalEventSchema = new Schema<IPersonalEvent>({
    creator: { type: String, required: true },
    description: String,
})

const PersonalEventModel = model<IPersonalEvent>("PersonalEvent", PersonalEventSchema)

export default PersonalEventModel