const mongoose = require("mongoose")
const validate = require("mongoose-validator")
const uniqueValidator = require("mongoose-unique-validator")

const usernameValidator = [
  validate({
    validator: "isAlphanumeric",
    passIfEmpty: true,
    message: "Username should contain only alpha-numeric characters"
  }),
]

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    validate: usernameValidator,
  },
  passwordHash: String,
  name: {
    type: String,
    minlength: 2
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    },
  ],
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)