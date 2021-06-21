import { NAME_REGEX, POSTCODE_REGEX } from "../regex"
import mongoose from "mongoose"

export type IAddress = {
  careof?: string
  street: string
  streetAddtional: string
  postcode: string
  district?: string
  city: string
  state?: string
  country: string
}

export const AddressSchema = new mongoose.Schema({
  careof: { type: String },
  street: { type: String, required: [true, "Street is required"] },
  streetAddtional: { type: String },
  postcode: {
    type: String,
    required: true,
    maxLength: [5, "Postcode should be of 5 digits"],
    minLength: [5, "Postcode should be of 5 digits"],
    match: [POSTCODE_REGEX, "not a valid postcode"],
  },
  district: { type: String },
  city: {
    type: String,
    required: [true, "City is required"],
    match: [NAME_REGEX, "not a valid City"],
  },
  state: { type: String, match: [NAME_REGEX, "not a valid name"] },
  country: {
    type: String,
    required: [true, "Country is required"],
    match: [NAME_REGEX, "not a valid Country"],
  },
})
