const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post("/", async (request, response) => {
  const body = request.body

  const user = !body.userId
    ? await User.findOne({})
    : await User.findById(body.userId)
  // const user = await User.findById(body.userId)
  // const otherUser = await User.findOne({})
  // console.log(user)
  // console.log("o", otherUser)
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

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
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