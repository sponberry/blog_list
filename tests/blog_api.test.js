const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const app = require("../app")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test("blogs returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("all blogs fetched from server", async () => {
  const response = await api.get("/api/blogs")
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test("a specific blog is returned", async () => {
  const response = await api.get("/api/blogs")
  const titles = response.body.map(b => b.title)

  expect(titles).toContain("Test Blogging: An exercise in humility")
})

afterAll(() => {
  mongoose.connection.close()
})