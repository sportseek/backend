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
  Name: string
  Email: string
  Password: string
  ProjectsCreated: string[]
  ProjectsInvolved: string[]
  ProfileImageUrl: string
  ProfileImageId: string
}

export const PlayerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name required"],
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
})

const Player = mongoose.model<IPlayer>("Player", PlayerSchema)
export default Player
