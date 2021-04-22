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

const getAll = () => {
  const response = api.get("/api/blogs")
  return response
}

test("blogs returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("all blogs fetched from server", async () => {
  const response = await getAll()
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test("a specific blog is returned", async () => {
  const response = await getAll()
  const titles = response.body.map(b => b.title)

  expect(titles).toContain("Test Blogging: An exercise in humility")
})

test("id variable named without underscore", async () => {
  const response = await getAll()
  response.body.map(b => {
    expect(b.id).toBeDefined()
  })
})

test("valid blog added with post request", async () => {
  const newBlog = {
    title: "Hiking for Beginners",
    author: "Glenn C",
    url: "http://www.canyonsandstuff.com",
    likes: 14,
  }
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const response = await getAll()
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain("Hiking for Beginners")
})

afterAll(() => {
  mongoose.connection.close()
})