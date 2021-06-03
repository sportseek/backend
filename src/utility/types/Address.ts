export type AddressType = {
  careof?: string
  street: string
  postcode: string
  district?: string
  city: string
  state?: string
  country: string
}

export const AddressSchema = {
  careof: { type: String },
  street: { type: String, required: true },
  postcode: { type: Number, required: true },
  district: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
}
