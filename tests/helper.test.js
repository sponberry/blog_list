const listHelper = require("../utils/list_helper")

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]

const listWithMoreBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]


test("dummy returns one", () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe("total likes", () => {

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test("when list has more blogs equals the sum of all likes", () => {
    const result = listHelper.totalLikes(listWithMoreBlogs)
    expect(result).toBe(36)
  })

  test("when list is empty equals 0", () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe("favourite blog from array", () => {

  test("when list has one blog, returns that entry", () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    })
  })

  test("when list has more blogs, returns entry with most likes", () => {
    const result = listHelper.favouriteBlog(listWithMoreBlogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    })
  })

  test("when list empty returns 'none'", () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toBe("none")
  })
})

describe("author with most blogs", () => {

  test("when list has one blog, returns the author", () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toBe("Edsger W. Dijkstra")
  })

  test("when list has more than one blog, returns the name that's authored the most", () => {
    const result = listHelper.mostBlogs(listWithMoreBlogs)
    expect(result).toBe("Robert C. Martin")
  })

  test("when list empty returns 'none'", () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe("none")
  })
})