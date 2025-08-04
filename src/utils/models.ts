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

// Export the model with proper typing
export const User = mongoose.model<IUser>("User", userSchema);
export const Shipment = mongoose.model("Shipment", shipmentSchema);
