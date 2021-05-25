import { ADDRESS_MIN_LENGTH, PHONE_MIN_LENGTH } from './../../utility/constants/playerConstants';
import mongoose from "mongoose"
import {
  PLAYER_NAME_MAX,
  PLAYER_NAME_MIN,
  PLAYER_EMAIL_MAX,
  PLAYER_EMAIL_MIN,
  PLAYER_PASSWORD_MAX,
  PLAYER_PASSWORD_MIN,
} from "../../utility/constants/playerConstants"

export interface IPlayer extends mongoose.Document {
  FirstName: string;
  LastName: string
  Email: string;
  Password: string;
  Address: string;
  Phone: string;
  Wallet: number;
  ProfileImageUrl: string;
  RegisteredEvents: string[];
  InterestedEvents: string[];
}

export const PlayerSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "First Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
  },
  LastName: {
    type: String,
    required: [true, "Last Name required"],
    minLength: [PLAYER_NAME_MIN, `Minimum length ${PLAYER_NAME_MIN}`],
    maxLength: [PLAYER_NAME_MAX, `Maximum length ${PLAYER_NAME_MAX}`],
  },
  Email: {
    type: String,
    required: [true, "Email required"],
    minLength: [PLAYER_EMAIL_MIN, `Minimum length ${PLAYER_EMAIL_MIN}`],
    maxLength: [PLAYER_EMAIL_MAX, `Maximum length ${PLAYER_EMAIL_MAX}`],
  },
  Password: {
    type: String,
    required: [true, "Password required"],
    minLength: [PLAYER_PASSWORD_MIN, `Minimum length ${PLAYER_PASSWORD_MIN}`],
  },
  Address: {
    type: String,
    required: [true, "Address required"],
    minLength: [ADDRESS_MIN_LENGTH, `Minimum length ${ADDRESS_MIN_LENGTH}`],
  },
  Phone: {
    type: String,
    required: [true, "Phone number required"],
    minLength: [PHONE_MIN_LENGTH, `Minimum length ${PHONE_MIN_LENGTH}`],
  },
  Wallet: {
    type: Number,
    required: [true, "Wallet required"],
  },
  ProfileImageUrl: {
    type: String,
    required: [true, "Profile Image Required required"],
  },
  RegisteredEvents: {
    type: [String],
    required: [true, "Registered events required"],
  },
  InterestedEvents: {
    type: [String],
    required: [true, "Interested events required"],
  },
})

const Player = mongoose.model<IPlayer>("Player", PlayerSchema)
export default Player
