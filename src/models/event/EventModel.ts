import { Schema, model } from "mongoose"
import { Event as CalenderEvent } from "react-big-calendar"
import { AddressSchema, IAddress } from "../../utility/types/Address"
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
  address: IAddress
  status: string
  eventImageUrl: string
}

const EventSchema = new Schema<IEvent>({
  creator: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  description: {
    type: String,
    default: "",
    requried: [true, "description required"],
    minLength: [4, `Minimum length ${4}`],
    maxLength: [5000, `Maximum length ${5000}`],
  },
  sportType: { type: String, default: "", required: true },
  entryFee: {
    type: Number,
    default: 0,
    required: true,
    min: [0, "Must be a positive number"],
  },
  minPlayers: {
    type: Number,
    default: 0,
    required: true,
    min: [0, "Must be a positive number"],
  },
  maxPlayers: {
    type: Number,
    default: 0,
    required: true,
    min: [0, "Must be a positive number"],
  },
  registeredPlayers: { type: [String], default: [], required: true },
  interestedPlayers: { type: [String], default: [], required: true },
  revenue: { type: Number, default: 0, required: true },
  address: { type: AddressSchema, required: false },
  allDay: Boolean,
  title: {
    type: String,
    requried: [true, "title required"],
    minLength: [4, `Minimum length ${4}`],
    maxLength: [256, `Maximum length ${256}`],
  },
  start: { type: Date, default: Date.now, required: true },
  end: { type: Date, default: Date.now, required: true },
  status: { type: String, required: true },
  eventImageUrl: { type: String, required: true },
})

const EventModel = model<IEvent>("Event", EventSchema)

export default EventModel
