const Blog = require("../models/blog")
const User = require("../models/user")

const usersDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const returnUserIds = (async () => {
  const allUsers = await usersDb()
  return allUsers.map(u => u.id)
})

const initialBlogs = [
  {
    "title": "Test Blogging: An exercise in humility",
    "author": "Abi N",
    "url": "https://abigail-illustration.com",
    "likes": 4,
    __v: 0,
  },
  {
    "title": "How to Listen to Lo-Fi Without it Affecting Your Algorithm",
    "author": "Genie U S",
    "url": "https://www.fakewebsite.com",
    "likes": 20,
    __v: 0,
    // "user": "6087b117d92f5b06fa598fa0"
  },
  {
    "title": "Private Blogs: When a Tree Falls and No-one Hears It",
    "author": "Polly A",
    "url": "https://www.fakewebsite.com",
    "likes": 8,
    __v: 0,
    // "user": "608a823e803b3875b23ad5ae"
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

const getToken = (async (api) => {
  const userToLogin = {
    "username": "root",
    "password": "sekret"
  }
  const response = await api
    .post("/api/login")
    .send(userToLogin)

  return `bearer ${response.body.token}`
})

module.exports = {
  initialBlogs,
  blogsDb,
  nonExistingId,
  usersDb,
  getToken,
  returnUserIds
}