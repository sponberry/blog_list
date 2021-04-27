const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.post("/", async (request, response) => {
  const body = request.body

  if (body.password.length < 8) {
    return response.status(401).json({
      error: "Password must be at least 8 characters"
    })
  }
  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    passwordHash,
    name: body.name,
    blogs: []
  })

  const savedUser = await user.save()


  console.log("response", response.status)
  response.json(savedUser)
})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
  return response.json(users)
})

module.exports = usersRouter