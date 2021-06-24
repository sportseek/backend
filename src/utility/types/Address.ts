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
  careof: { type: String, default: "" },
  street: {
    default: "",
    required: [true, "Street is required"],
    type: String,
    trim: true,
  },
  streetAddtional: { type: String, default: "", trim: true },
  postcode: {
    type: String,
    trim: true,
    default: "",
    required: [true, "Postcode is required"],
    maxLength: [5, "Postcode should be of 5 digits"],
    minLength: [5, "Postcode should be of 5 digits"],
    match: [POSTCODE_REGEX, "not a valid postcode"],
  },
  district: { type: String, default: "", trim: true },
  city: {
    type: String,
    trim: true,
    default: "",
    required: [true, "City is required"],
    match: [NAME_REGEX, "not a valid City"],
  },
  state: {
    type: String,
    default: "",
    trim: true,
    match: [NAME_REGEX, "not a valid name"],
  },
  country: {
    type: String,
    trim: true,
    default: "",
    required: [true, "Country is required"],
    match: [NAME_REGEX, "not a valid Country"],
  },
})
