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

export const AddressSchema = {
  careof: { type: String },
  street: { type: String, required: true },
  streetAddtional: { type: String },
  postcode: { type: Number, required: true },
  district: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
}
