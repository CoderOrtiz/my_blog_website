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

// Declaring Content for Home, About, and Contact Pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


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
  res.render("about", {aboutContent: aboutContent});
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
