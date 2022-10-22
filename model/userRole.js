import mongoose from "mongoose";

const Schema = mongoose.Schema;
let userRoleSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UserRoleModel", userRoleSchema);
