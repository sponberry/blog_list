const bcrypt = require("bcrypt")
const User = require("../models/user")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("sekret", 10)
  const user = new User({ username: "root", passwordHash })
  await user.save()
})

describe("when there is initially one user in the database", () => {

  test("creation succeeds with a new username", async () => {
    const usersAtStart = await helper.usersDb()

    const newUser = {
      username: "sponberry",
      name: "Abi N",
      password: "higgledy"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})