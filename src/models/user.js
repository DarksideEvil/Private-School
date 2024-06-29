const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["device", "admin", "boss"],
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const UserModel = model("user", userSchema);

module.exports = UserModel;
