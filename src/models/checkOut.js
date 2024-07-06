const { Schema, model } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const moment = require("moment");

const checkoutSchema = new Schema(
  {
    pupil: {
      type: Schema.Types.ObjectId,
      ref: "pupil",
      required: true,
    },
    checkIn: {
      type: String,
      default: moment().format("YYYY-MM-DD HH:mm"),
    },
    checkOut: {
      type: String,
      default: moment().format("YYYY-MM-DD HH:mm"),
    },
  },
  { versionKey: false, timestamps: true }
);

checkoutSchema.plugin(aggregatePaginate);

module.exports = model("checkout", checkoutSchema);
