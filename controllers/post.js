const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");

//pulling data from quotable api
router.get("/new", (req, res) => {
  axios
    .get(`https://api.quotable.io/random?maxLength=80#`)
    .then((response) => {
      res.render("post.ejs", { quote: response.data });
    })
    .catch(console.log());
});
//showing single post/post to the showpost.ejs page
router.get("/:id", async (req, res) => {
  try {
    //find specific post from db -- with join sql request
    const post = await db.post.findByPk(req.params.id, {
      include: [db.comment],
    });
    res.render("showpost.ejs", { post });
  } catch (err) {
    console.log(err);
  }
});

//creates an post/post with the form data - when user click publish button
router.post("/", async (req, res) => {
  //create post object with columns
  const post = await db.post.create({
    quote: req.body.quote,
    author: req.body.author,
    body: req.body.postBody,
    userId: res.locals.user.dataValues.id,
  });
  //redirect the user once the post has been create in db
  res.redirect(`post/${post.id}`);
});

//create route that add comments to post/post
//url ---> /post/:id/comment
router.post("/:id/comments", async (req, res) => {
  try {
    //create comment for the compuseQuote in db
    const newComment = await db.comment.create({
      body: req.body.body,
      userId: res.locals.user.id,
      postId: req.params.id,
    });
    console.log(newComment);
    //redirect shows post and new comment
    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

//shows the edit form to the user
router.get("/:id/edit", async (req, res) => {
  try {
    let quote = await db.post.findByPk(req.params.id);
    if (quote.userId !== res.locals.user.dataValues.id) {
      res.render("notauthorized.ejs");
      return;
    }
    res.render("edit", { quote });
  } catch (err) {
    console.log(err);
  }
});
//update data for specific id of post
router.put("/:id", async (req, res) => {
  try {
    let postBody = await db.post.findByPk(req.params.id);
    console.log(postBody);
    if (postBody.userId !== res.locals.user.dataValues.id) {
      res.render("notauthorized.ejs");
      return;
    }
    postBody.body = req.body.postBody;
    postBody.quote = req.body.quote;
    postBody.author = req.body.author;
    postBody.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//delete specific post from db
router.delete("/:id", async (req, res) => {
  try {
    let quote = await db.post.findByPk(req.params.id);
    if (quote.userId !== res.locals.user.dataValues.id) {
      res.render("notauthorized.ejs");
      return;
    }
    await quote.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
