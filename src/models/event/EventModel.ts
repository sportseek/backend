import { Schema, model } from "mongoose"
import { Event as CalenderEvent } from "react-big-calendar"
import { Location } from "./location"

interface IEvent extends CalenderEvent {
  creator: string
  location: Location
  description: string
  sportType: string
  entryFee: number
  minPlayers: number
  maxPlayers: number
  registeredPlayers: string[]
  interestedPlayers: string[]
  revenue: number
}

const EventSchema = new Schema<IEvent>({
  creator: { type: String, required: true },
  location: { lat: Number, lng: Number },
  description: { type: String, required: true },
  sportType: { type: String, required: true },
  entryFee: { type: Number, required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  registeredPlayers: { type: [String], required: true },
  interestedPlayers: { type: [String], required: true },
  revenue: { type: Number, required: true },
  allDay: Boolean,
  title: { type: String },
  start: { type: Date, default: Date.now, required: true },
  end: { type: Date, default: Date.now, required: true },
})

const EventModel = model<IEvent>("Event", EventSchema)

export default EventModel
