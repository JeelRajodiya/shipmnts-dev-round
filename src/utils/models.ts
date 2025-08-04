import mongoose, { Document, Schema } from "mongoose";
import { required } from "zod/mini";

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  age: number;
}

// Create the schema with type annotations
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
});

const shipmentSchema = new Schema({
  shipment_number: {
    type: Number,
    required: true,
  },
  hops: [
    {
      type: String,
      required: true,
    },
  ],
});
// "data": {
//   "shipment_number": "12345",
//   "flight_number": "em-789",
//   "flight_path": "Ahmedabad - Emirates - Dubai",
//   "departure": "1754043211",
//   "arrival": "1754007211",
//   “status”: ‘in-transit’ // default status.
// }

const flightSchema = new Schema({
  shipment_number: {
    type: Number,
    required: true,
  },
  flight_number: {
    type: String,
    required: true,
  },
  flight_path: {
    type: String,
    required: true,
  },
  departure: {
    type: Date,
    required: true,
  },
  arrival: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "in-transit",
    required: false,
  },
  carrier: {
    type: String,
    default: "in-transit",
    required: false,
  },
});
// Export the model with proper typing
export const User = mongoose.model<IUser>("User", userSchema);
export const Shipment = mongoose.model("Shipment", shipmentSchema);
export const Flight = mongoose.model("Flight", flightSchema);
