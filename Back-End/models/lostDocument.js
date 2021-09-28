const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  serial: { type: String },
  encText: { type: String },
  isMatched: { type: Boolean },
  uploadedBy: { type: String, required: true },
  userEmail: { type: String, required: true },
  userMobilrNo: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("lostDocument", documentSchema);
