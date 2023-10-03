const express = require("express");
const _ = require("lodash");
const blogData = require("./middleware/blogData");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(blogData); //fetching the blogs and storing it in req.blogs

app.get("/api/blog-stats", async (req, res, next) => {
  try {
    const { blogs } = req.blogs;
    const totalBlogs = _.size(blogs);
    const longestTitleBlog = _.maxBy(blogs, "title.length");
    const blogsWithPrivacy = _.filter(blogs, (blog) =>
      _.includes(_.toLower(blog.title), "privacy")
    );

    const uniqueTitles = _.uniqBy(blogs, "title").map((blog) => blog.title);

    const blogStats = {
      totalBlogs,
      longestTitleBlog,
      numberOfBlogsWithPrivacy: _.size(blogsWithPrivacy),
      uniqueTitles,
    };

    res.status(200).json(blogStats);
  } catch (error) {
    console.error("Error calculating blog statistics:", error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating blog statistics." });
  }
});

app.get("/api/blog-search", (req, res, next) => {
  try {
    const { blogs } = req.blogs;

    const query = req.query.query || "";

    const searchResults = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json(searchResults);
  } catch (error) {
    console.error("Error performing blog search:", error);
    res
      .status(500)
      .json({ error: "An error occurred while performing blog search." });
  }
});

// Handle 404 errors (route not found)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Handle uncaught errors
app.use((err, req, res, next) => {
  console.error("Uncaught error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(3000, () => {
  console.log(`Server started at: ${3000}`);
});
