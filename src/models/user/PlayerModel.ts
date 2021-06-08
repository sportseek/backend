import mongoose from "mongoose"
import {
  ADDRESS_MIN_LENGTH,
  PHONE_MIN_LENGTH,
  PLAYER_NAME_MAX,
  PLAYER_NAME_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_EMAIL_MIN,
  PLAYER_PASSWORD_MIN,
} from "../../utility/constants/playerConstants"

import { AddressType, AddressSchema } from "../../utility/types/Address"
import { LocationType, LocationSchema } from "../../utility/types/Location"

export interface IPlayer extends mongoose.Document {
  firstName: string
  lastName: string
  email: string
  type: string
  location: LocationType
  password: string
  address: AddressType
  phone: string
  wallet: number
  profileImageUrl: string
  registeredEvents: string[]
  interestedEvents: string[]
}

export const PlayerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
  },
  lastName: {
    type: String,
    required: [true, "Last Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    minLength: [PLAYER_EMAIL_MIN, `Minimum length ${PLAYER_EMAIL_MIN}`],
    maxLength: [PLAYER_EMAIL_MAX, `Maximum length ${PLAYER_EMAIL_MAX}`],
  },
  type: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minLength: [PLAYER_PASSWORD_MIN, `Minimum length ${PLAYER_PASSWORD_MIN}`],
  },
  location: { type: LocationSchema },
  address: {
    type: AddressSchema,
    minLength: [ADDRESS_MIN_LENGTH, `Minimum length ${ADDRESS_MIN_LENGTH}`],
  },
  phone: {
    type: String,
    required: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
  },
  wallet: {
    type: Number,
    required: [true, "Wallet required"],
  },
  profileImageUrl: {
    type: String,
    required: [true, "Profile Image Required required"],
  },
  registeredEvents: {
    type: [String],
    required: [true, "Registered events required"],
  },
  interestedEvents: {
    type: [String],
    required: [true, "Interested events required"],
  },
})

const Player = mongoose.model<IPlayer>("Player", PlayerSchema)
export default Player
