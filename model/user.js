import mongoose from "mongoose";

const Schema = mongoose.Schema;
let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  history: {
    type: Array,
  },
});

export default mongoose.model("UserModel", userSchema);
