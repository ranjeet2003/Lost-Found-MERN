const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  docs: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
  // signed: { type: Boolean },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
