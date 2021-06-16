const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  serial: { type: String },
  // isFound: { type: Boolean, required: true },
  // img: {
  //   data: Buffer,
  //   contentType: String,
  // },
});

module.exports = mongoose.model("foundDocument", documentSchema);
