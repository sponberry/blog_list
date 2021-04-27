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

  test("creation fails with status 400 on duplicate username", async () => {
    const usersAtStart = await helper.usersDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "password"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("creation fails if password too short or missing", async () => {
    const usersAtStart = await helper.usersDb()
    const invalidPasswordUser = {
      username: "beedleweedle",
      password: "p"
    }
    const result = await api
      .post("/api/users")
      .send(invalidPasswordUser)
      .expect(401)

    expect(result.body.error).toContain("Password must be at least 3 characters")

    const missingPasswordUser = {
      username: "beedleweedle"
    }
    const newresult = await api
      .post("/api/users")
      .send(missingPasswordUser)
      .expect(401)

    expect(newresult.body.error).toContain("You must set a password")

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("creation fails if username too short or missing", async () => {
    const usersAtStart = await helper.usersDb()
    const invalidUsername = {
      username: "an",
      password: "password"
    }
    const result = await api
      .post("/api/users")
      .send(invalidUsername)
      .expect(400)

    expect(result.body.error).toContain("is shorter than the minimum allowed length")

    const missingUsername = {
      password: "beedleweedle"
    }
    const newresult = await api
      .post("/api/users")
      .send(missingUsername)
      .expect(400)

    expect(newresult.body.error).toContain("`username` is required")

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})