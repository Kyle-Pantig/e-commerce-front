import { Schema, model, models } from "mongoose";
const AddressSchema = new Schema({
  userEmail: { type: String, unique: true, required: true },
  name: String,
  email: String,
  country: String,
  province: String,
  city: String,
  streetBarangay: String,
  postalCode: String,
});

export const Address = models?.Address || model("Address", AddressSchema);
