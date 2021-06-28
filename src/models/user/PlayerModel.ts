import mongoose from "mongoose"
import {
  PHONE_MIN_LENGTH,
  PLAYER_NAME_MAX,
  PLAYER_NAME_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_EMAIL_MIN,
  PLAYER_PASSWORD_MIN,
} from "../../utility/constants/playerConstants"

import { IAddress, AddressSchema } from "../../utility/types/Address"
import { LocationType, LocationSchema } from "../../utility/types/Location"

import {
  EMAIL_REGEX,
  MOBILE_PHONE_REGEX,
  NAME_REGEX,
} from "../../utility/regex"

export interface IPlayer {
  firstName: string
  lastName: string
  email: string
  type: string
  location: LocationType
  password: string
  address: IAddress
  phone: string
  wallet: number
  profileImageUrl: string
  registeredEvents: string[]
  interestedEvents: string[]
  friends: string[]
}

export const PlayerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "First Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
    match: [NAME_REGEX, "not a valid First name"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
    match: [NAME_REGEX, "not a valid Last name"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Email required"],
    minLength: [PLAYER_EMAIL_MIN, `Minimum length ${PLAYER_EMAIL_MIN}`],
    maxLength: [PLAYER_EMAIL_MAX, `Maximum length ${PLAYER_EMAIL_MAX}`],
    match: [EMAIL_REGEX, "not a valid email"],
  },
  type: {
    type: String,
    default: "player",
    immutable: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password required"],
    minLength: [PLAYER_PASSWORD_MIN, `Minimum length ${PLAYER_PASSWORD_MIN}`],
  },
  location: {
    type: LocationSchema,
    default: { lat: 48.137154, lng: 11.576124 },
  },
  address: {
    type: AddressSchema,
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
    match: [MOBILE_PHONE_REGEX, "not a valid mobile phone number"],
  },
  wallet: {
    type: Number,
    default: 0,
    required: [true, "Wallet required"],
  },
  profileImageUrl: {
    type: String,
    default: "",
  },
  registeredEvents: {
    type: [String],
    default: [],
    required: [true, "Registered events required"],
  },
  interestedEvents: {
    type: [String],
    default: [],
    required: [true, "Interested events required"],
  },
  friends: {
    type: [String],
    default: [],
  },
})

const Player = mongoose.model<IPlayer>("Player", PlayerSchema)

export default Player
