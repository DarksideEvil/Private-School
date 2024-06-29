const { Schema, model } = require("mongoose");

const pupilSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    parent: {
      fullname: { type: String },
      phone: { type: String },
    },
    img: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    birthCertificate: {
      type: String,
      default: null,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "group",
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const PupilModel = model("pupil", pupilSchema);

module.exports = PupilModel;
