// Requiring Express, Body Parser, EJS, BootStrap(path), and Mongoose
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Renaming Express as "app"
const app = express();

// Using Express Templet Engine
app.set('view engine', 'ejs');

// Returns Middleware that Only Parses {urlencoded} Bodies and Only Looks at Requests Where the Content-Type Header Matches the Type Option
app.use(bodyParser.urlencoded({extended: true}));

// Using Express to Serve Static CSS Files From the Public Folder
app.use(express.static("public"));

// Connects to MongoDB Atlas
mongoose.connect("mongodb+srv://CoderOrtiz:eD9smw0q03kERXGt@cluster0.ps36b.mongodb.net/blogDB");

// Post Schema
const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

// Mongoose Model
const Post = mongoose.model("Post", postSchema);

// Declaring Content for Home, and Contact Pages
const homeStartingContent = "Welcome to my Blog Website! This is a simple CRUD Full-stack Website to practice using editing MongoDB from the site. This website is Responsive so feel free to check it out in different settings. If you want to know more about this project, feel free to stop by the About Section. If you want to get in contact with me, please visit the Contact Section. Thanks for visiting  👋🏽";
const contactContent = "Welcome to my Contact Page! The best way to get in contact with me is through LinkedIn! Stop by my GitHub if you have the time 🙂";


///////////////////////// Home Page /////////////////////////////

// "app.get" Uses Express to Route the HTTP GET Requests to the Path Which is Being Specified with the Specified Callback Function
app.get("/", function(req, res){
  
  // ".find" using a MongoDB Method to select Documents in a Collection and Return it
  // {} Is Returning All Documents in a Collection
  Post.find({}, function(err, posts){

    // The res.render() Function is Used to Render a View (The View File) and Sends the Rendered HTML String to the Client. 
    res.render("home", {
      // Key Value Pairs between App.JS and Home.EJS
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});


///////////////////////// Compose Page /////////////////////////////

// When the User goes to /compose, Renders Compose.EJS
app.get("/compose", function(req, res){
  res.render("compose");
});

// The app.post() Function Routes the HTTP POST Requests to the Specified Path with the Specified Callback Functions
app.post("/compose", function(req, res){
  // Taking Data Collected From /compose and Storing it in Two Variables then Saving the Object in the Post Model and then the Post Variable
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // Saving the post and Redirecting to the Home Route
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


///////////////////////// Post Page /////////////////////////////

// Using Express Route Parameters
app.get("/posts/:postId", function(req, res){

// req.params Is Part of the Syntax Needed for Route Parameters
const requestedPostId = req.params.postId;
  // Finds the Requested Post and Renders it using Post.EJS
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


///////////////////////// About Page /////////////////////////////

// When in /about Renders About.EJS and its Content
app.get("/about", function(req, res){
  res.render("about");
});

///////////////////////// Contact Page /////////////////////////////

// When in /contact Renders Contact.EJS and its Content
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


/////////////// Selecting What Ports to Utilize ///////////////////

// The Port Automatically Assigned by MongoDB
let port = process.env.PORT;

// If the MongoDB Port is Not Working, use Port 3000
if (port == null || port == "") {
  port = 3000;
}

// Port Status
app.listen(port, function() {
  console.log(`Server Has Started Successfully on Port ${port}!`);
});
