const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

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
  author: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
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

app.get("/editPost/:_id", (req, res) => {
  Blog.find({ _id: req.params.id }, (err, post) => {
    res.render("editPost", { post: post });
    console.log(post.title);
  });
});

app.delete("/delete/:id", (req, res) => {
  Blog.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (err) return res.send(500, err);
    res.send({ message: "Post deleted" });
  });
});

app.put("/editPost/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    data
  ) {
    if (err) return next(err);
    res.send("Data udpated.");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
