const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contact = new Schema({
  name: { type: String, require: [true, "Set name for contact"], minLenght: 2 },
  email: { type: String, require: true, minLength: 2 },
  phone: { type: String, require: true, minLength: 2 },
  favorite: { type: Boolean, require: true },
  age: { type: Number, require: true, minLength: 1 },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("contacts", contact);

module.exports = Contact;
