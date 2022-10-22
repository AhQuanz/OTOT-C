import mongoose from "mongoose";

const Schema = mongoose.Schema;
let userTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("UserTokenModel", userTokenSchema);
