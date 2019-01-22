//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Create database and establish connection.
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

// Create a Mongoose schema.
const articleSchema = {
  title: String,
  content: String
};

// Create a Mongoose model.
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////// Requests Targeting ALL Articles //////////////////////////////////

// Create chainable route handler
app.route("/articles")
// Set GET route for the articles.
.get(function(req, res) {
  // Read data.
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

// Set post
.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
// Use the delete method.
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

/////////////////////////////// Requests Targeting A Specific Article //////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title.");
      }
  });
})

.put(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Succesfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.patch(function(req, res) {
  Article.updateMany(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Succesfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Succesfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
