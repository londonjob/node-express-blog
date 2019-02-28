const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://test:test123@ds063178.mlab.com:63178/londonjob", {
  useNewUrlParser: true
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static("css"));

// Mongoose Model for our blog posts

var blogSchema = mongoose.Schema({
  title: String,
  post: String,
  author: String
});

var Blog = mongoose.model("Blog", blogSchema);

// Routes

app.get("/", (req, res) => {
  Blog.find({}, (err, posts) => {
    res.render("index", { posts: posts });
  });
});

app.get("/addPost", (req, res) => res.render("addPost"));

app.post("/addPost", (req, res) => {
  var blogData = new Blog(req.body);
  blogData
    .save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).send("Unable to save the data");
    });
});

app.get("/editPost/:id", (req, res) => {
  Blog.find({}, (err, posts) => {
    res.render("editPost", { posts: posts });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
