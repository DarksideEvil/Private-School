const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const GroupModel = model("group", groupSchema);

module.exports = GroupModel;
