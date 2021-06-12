import { Schema, model } from "mongoose"
import { Event as CalenderEvent } from "react-big-calendar"
import { AddressSchema, AddressType } from "../../utility/types/Address"
import { LocationSchema, LocationType } from "../../utility/types/Location"

interface IEvent extends CalenderEvent {
  creator: string
  location: LocationType
  description: string
  sportType: string
  entryFee: number
  minPlayers: number
  maxPlayers: number
  registeredPlayers: string[]
  interestedPlayers: string[]
  revenue: number
  address: AddressType
}

const EventSchema = new Schema<IEvent>({
  creator: { type: String, required: true },
  location: { type: LocationSchema,  },
  description: { type: String, required: true },
  sportType: { type: String, required: true },
  entryFee: { type: Number, required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  registeredPlayers: { type: [String], required: true },
  interestedPlayers: { type: [String], required: true },
  revenue: { type: Number, required: true },
  address: { type: AddressSchema, },
  allDay: Boolean,
  title: { type: String },
  start: { type: Date, default: Date.now, required: true },
  end: { type: Date, default: Date.now, required: true },
})

const EventModel = model<IEvent>("Event", EventSchema)

export default EventModel
