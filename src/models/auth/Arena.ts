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
  ArenaName: string
  Email: string
  Password: string
  Address: string
  Phone: string
  Location: [number]
  MonthlyFee: number
  ArenaImageUrl: string
  BankAccount: string
}

export const ArenaSchema = new mongoose.Schema({
  ArenaName: {
    type: String,
    requried: [true, "Arena name required"],
    minLength: [ARENA_NAME_MIN, `Minimum length ${ARENA_NAME_MIN}`],
    maxLength: [ARENA_NAME_MAX, `Minimum length ${ARENA_NAME_MAX}`],
  },
  Email: {
    type: String,
    requried: [true, "Email required"],
    minLength: [ARENA_EMAIL_MIN, `Minimum length ${ARENA_EMAIL_MIN}`],
    maxLength: [ARENA_EMAIL_MAX, `Minimum length ${ARENA_EMAIL_MAX}`],
  },
  Password: {
    type: String,
    requried: [true, "Password required"],
    minLength: [ARENA_PASSWORD_MIN, `Minimum length ${ARENA_PASSWORD_MIN}`],
    maxLength: [ARENA_PASSWORD_MAX, `Minimum length ${ARENA_PASSWORD_MAX}`],
  },
  Address: {
    type: String,
    requried: [true, "Arena address required"],
    minLength: [ADDRESS_MIN_LENGTH, `Minimum length ${ADDRESS_MIN_LENGTH}`],
  },
  Phone: {
    type: String,
    requried: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
  },
  Location: {
    type: [Number],
    requried: [true, "Precise location required"],
  },
  MonthlyFee: {
    type: Number,
    requried: [true, "Monthly fee required"],
    minValue: [MONTHLY_FEE_MIN, `Minimum length ${MONTHLY_FEE_MIN}`],
  },
  ArenaImageUrl: {
    type: String,
    required: [true, "Arena Image Required required"],
  },
  BankAccount: {
    type: String,
    required: [true, "IBAN required"],
  },
})

const Arena = mongoose.model<IArena>("Arena", ArenaSchema)
export default Arena
