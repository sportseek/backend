import { LatLngLiteral } from "leaflet"

export interface LocationType extends LatLngLiteral {}

export const LocationSchema = { lat: Number, lng: Number }
