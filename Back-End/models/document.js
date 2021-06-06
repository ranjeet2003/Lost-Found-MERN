const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const documentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    serial: {type: String },
    isLost: { type: Boolean, required: true }
});

module.exports = mongoose.model('Document', documentSchema);