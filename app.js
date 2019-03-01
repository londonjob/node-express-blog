const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

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

app.put("/editPost/:id", (req, res) => {
  let id = ObjectID(req.params.id);
  Blog.find(id, (err, result) => {
    res.send(result);
  });

  //res.render("editPost", { post: post });
});

app.get("/editPost/:id", (req, res) => {
  let id = ObjectID(req.params.id);
  Blog.find(id, (err, post) => {
    res.render("editPost", { post: post });
  });
});

//app.get("/editPost/:_id", (req, res) => {
//  Blog.find({ _id: req.params.id }, (err, post) => {
//    res.render("editPost", { post: post });
//  });
// });

app.delete("/delete/:id", (req, res) => {
  let id = ObjectID(req.params.id);
  Blog.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      throw err;
    }

    res.send("data deleted");
  }).then(res.redirect("/"));
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
