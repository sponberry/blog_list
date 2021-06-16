const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate("user", { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post("/", async (request, response) => {
  const body = request.body

  if (!request.token || !request.user) {
    return response.status(401).json({
      error: "token missing or invalid - please refresh page and login again"
    })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.post("/:id/comments", async (request, response) => {
  const blog = {
    comments: request.body.comments
  }
  if (!blog) {
    return response.status(401).json({
      error: "missing blog post"
    })
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
    response.status(201).json(updatedBlog)
  }
})

blogRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog || !request.user) {
    return response.status(401).json({
      error: "missing blog post or user id invalid - please refresh and login again"
    })
  } else if (blog.user.toString() === request.user.id.toString()) {
    await Blog.deleteOne({ _id: blog.id })
  } else {
    return response.status(401).json({
      error: "user id does not match blog author id"
    })
  }
  response.status(204).end()
})

blogRouter.put("/:id", async (request, response) => {
  const blog = {
    likes: request.body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
  response.json(updatedBlog)
})

module.exports = blogRouter