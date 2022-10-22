import mongoose from "mongoose";

const Schema = mongoose.Schema;
let rolePermissionModel = new Schema({
  role: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  route: {
    type: String,
    require: true,
  },
});

export default mongoose.model("rolePermissionModel", rolePermissionModel);
