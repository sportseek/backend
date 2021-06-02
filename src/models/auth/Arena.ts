import {
  ARENA_NAME_MAX,
  ARENA_NAME_MIN,
  ARENA_EMAIL_MAX,
  ARENA_EMAIL_MIN,
  ARENA_PASSWORD_MAX,
  ARENA_PASSWORD_MIN,
  ADDRESS_MIN_LENGTH,
  PHONE_MIN_LENGTH,
  MONTHLY_FEE_MIN,
} from "../../utility/constants/arenaConstants"
import mongoose from "mongoose"

export interface IArena extends mongoose.Document {
  aenaName: string
  email: string
  password: string
  address: string
  phone: string
  location: [number]
  monthlyFee: number
  arenaImageUrl: string
  bankAccount: string
}

export const ArenaSchema = new mongoose.Schema({
  arenaName: {
    type: String,
    requried: [true, "Arena name required"],
    minLength: [ARENA_NAME_MIN, `Minimum length ${ARENA_NAME_MIN}`],
    maxLength: [ARENA_NAME_MAX, `Minimum length ${ARENA_NAME_MAX}`],
  },
  email: {
    type: String,
    requried: [true, "Email required"],
    minLength: [ARENA_EMAIL_MIN, `Minimum length ${ARENA_EMAIL_MIN}`],
    maxLength: [ARENA_EMAIL_MAX, `Minimum length ${ARENA_EMAIL_MAX}`],
  },
  password: {
    type: String,
    requried: [true, "Password required"],
    minLength: [ARENA_PASSWORD_MIN, `Minimum length ${ARENA_PASSWORD_MIN}`],
  },
  address: {
    type: String,
    requried: [true, "Arena address required"],
    minLength: [ADDRESS_MIN_LENGTH, `Minimum length ${ADDRESS_MIN_LENGTH}`],
  },
  phone: {
    type: String,
    requried: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
  },
  location: {
    type: [Number],
    requried: [true, "Precise location required"],
  },
  monthlyFee: {
    type: Number,
    requried: [true, "Monthly fee required"],
    minValue: [MONTHLY_FEE_MIN, `Minimum length ${MONTHLY_FEE_MIN}`],
  },
  arenaImageUrl: {
    type: String,
    required: [true, "Arena Image Required required"],
  },
  bankAccount: {
    type: String,
    required: [true, "IBAN required"],
  },
})

const Arena = mongoose.model<IArena>("Arena", ArenaSchema)
export default Arena
