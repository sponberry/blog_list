const Blog = require("../models/blog")

const initialBlogs = [
  {
    "title": "Test Blogging: An exercise in humility",
    "author": "Abi N",
    "url": "https://abigail-illustration.com",
    "likes": 4,
    __v: 0
  },
  {
    "title": "Private Blogs: When a Tree Falls and No-one Hears It",
    "author": "Polly A",
    "url": "https://www.fakewebsite.com",
    "likes": 8,
    __v: 0
  },
]
const blogsDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Blog title",
    author: "Amy Stake",
    url: "http://"
  })
  await blog.save()
  await blog.remove()
  return blog.id.toString()
}

module.exports = {
  initialBlogs,
  blogsDb,
  nonExistingId
}