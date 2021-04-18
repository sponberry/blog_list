const lodash = require("lodash")

const dummy = (blogs) => { // eslint-disable-line no-unused-vars
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (item, blog) => {
    return blog.likes + item
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  let faveBlog = { likes: 0 }
  blogs.map(blog => {
    if (blog.likes > faveBlog.likes) {
      faveBlog = blog
    }
  })
  return blogs.length === 0
    ? "none"
    : {
      title: faveBlog.title,
      author: faveBlog.author,
      likes: faveBlog.likes
    }
}

const mostBlogs = (blogs) => {
  let blogAuthors = []
  if (blogs.length !== 0) {
    blogs.map(blog => blogAuthors.push(blog.author))
    const countedBlogs = lodash.countBy(blogAuthors)
    const sortedBlogs = lodash(countedBlogs)
      .toPairs()
      .orderBy([1], ["desc"])
      .fromPairs()
      .value()
    return Object.keys(sortedBlogs)[0]
  } else {
    return "none"
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}