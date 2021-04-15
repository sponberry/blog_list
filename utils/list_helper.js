const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (item, blog) => {
    return blog.likes + item
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}