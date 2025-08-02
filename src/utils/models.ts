import mongoose, { Document, Schema } from "mongoose";

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

// Export the model with proper typing
export const User = mongoose.model<IUser>("User", userSchema);
