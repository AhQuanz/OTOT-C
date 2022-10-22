import mongoose from "mongoose";

const Schema = mongoose.Schema;
let userPermissionSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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

export default mongoose.model("UserPermissionModel", userPermissionSchema);
