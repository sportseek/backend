import {
  ARENA_NAME_MAX,
  ARENA_NAME_MIN,
  ARENA_EMAIL_MAX,
  ARENA_EMAIL_MIN,
  ARENA_PASSWORD_MIN,
  PHONE_MIN_LENGTH,
  MONTHLY_FEE_MIN,
} from "../../utility/constants/arenaConstants"

import mongoose from "mongoose"
import { IAddress, AddressSchema } from "../../utility/types/Address"
import { LocationType, LocationSchema } from "../../utility/types/Location"

export interface IArena extends mongoose.Document {
  arenaName: string
  type: string
  email: string
  password: string
  address: IAddress
  phone: string
  location: LocationType
  monthlyFee: number
  profileImageUrl: string
  profileImageId: string
  bankAccount: string
}

export const ArenaSchema = new mongoose.Schema({
  arenaName: {
    type: String,
    requried: [true, "Arena name required"],
    minLength: [ARENA_NAME_MIN, `Minimum length ${ARENA_NAME_MIN}`],
    maxLength: [ARENA_NAME_MAX, `Maximum length ${ARENA_NAME_MAX}`],
  },
  email: {
    type: String,
    unqiue: true,
    requried: [true, "Email required"],
    minLength: [ARENA_EMAIL_MIN, `Minimum length ${ARENA_EMAIL_MIN}`],
    maxLength: [ARENA_EMAIL_MAX, `Maximum length ${ARENA_EMAIL_MAX}`],
  },
  password: {
    type: String,
    requried: [true, "Password required"],
    minLength: [ARENA_PASSWORD_MIN, `Minimum length ${ARENA_PASSWORD_MIN}`],
  },
  type: {
    type: String,
    required: true,
  },
  address: {
    type: AddressSchema,
  },
  phone: {
    type: String,
    requried: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
  },
  location: {
    type: LocationSchema,
  },
  monthlyFee: {
    type: Number,
    requried: [true, "Monthly fee required"],
    minValue: [MONTHLY_FEE_MIN, `Minimum length ${MONTHLY_FEE_MIN}`],
  },
  profileImageUrl: {
    type: String,
  },
  profileImageId: {
    type: String,
  },
  bankAccount: {
    type: String,
    required: [true, "IBAN required"],
  },
})

const Arena = mongoose.model<IArena>("Arena", ArenaSchema)
export default Arena
