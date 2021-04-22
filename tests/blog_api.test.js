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

describe("when fetching all blogs from server", () => {

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
})

describe("when creating a new blog post request", () => {

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

  test("likes defaults to 0 if not entered", async () => {
    const newBlog = {
      title: "Ways to Tidy Your Flat",
      author: "Marie K",
      url: "http://www.tidytidytidy.com",
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await getAll()
    response.body.map(r => {
      expect(r.likes).toBeGreaterThanOrEqual(0)
    })
  })

  test("Bad request 400 returned if missing title", async () => {
    const invalidBlog = {
      author: "Andy J",
      url: "http://www.blogs.com",
      likes: 3
    }
    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(400)
  })
  test("Bad request 400 returned if missing url", async () => {
    const invalidBlog = {
      title: "Some Days Are Just a Write-Off",
      author: "Andy J",
      likes: 2
    }
    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(400)
  })
})

describe("when deleting a note", () => {

  test("204 status and less blogs returned", async () => {
    const blogsAtStart = await helper.blogsDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsDb()
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )
  })

  test("the blog title is no longer present", async () => {
    const blogsAtStart = await helper.blogsDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsDb()
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})