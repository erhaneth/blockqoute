const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

//pulling data from quotable api
router.get('/new', (req, res) => {
    axios.get(`https://api.quotable.io/random?maxLength=80#`)
        .then(response => {
            res.render('compose.ejs', { quote: response.data })
        })
        .catch(console.log())
})
//showing single compose/post to the showcompose.ejs page
router.get('/:id', async (req, res) => {
    try {
        //find specific post from db -- with join sql request
        const compose = await db.compose.findByPk(req.params.id, { include: [db.comment] })
        res.render('showcompose.ejs', { compose })

    } catch (err) {
        console.log(err)
    }
})


//creates an compose with the form data - when user click publish button
router.post("/", async (req, res) => {
    //create compose object with columns
    const compose = await db.compose.create({
        quote: req.body.quote,
        author: req.body.author,
        body: req.body.postBody

    })
    //redirect the user once the post has been create in db
    res.redirect(`compose/${compose.id}`)

});

//create route that add comments to compose post/compose/:id/comment
//url ---> /compose/:id/comment
router.post("/:id/comment", async (req, res) => {
    try {

        //create comment for the compuseQuote in db
        const newComment = await db.comment.create({

            body: req.body.body,
            userId: res.locals.user.id,
            composeId: req.params.id

        })
        //redirect shows compose and new comment
        //   const compose = await db.compose.findByPk(req.params.id)
        res.redirect(`/compose/${req.params.id}`)
    } catch (err) {
        console.log(err)
    }
});

//shows the edit form to user
router.get("/:id/edit", async (req, res) => {
    try {
        let quote = await db.compose.findByPk(req.params.id)
        if (quote.userId !== res.locals.userId) {
            res.render('notauthorized.ejs')
            return
        }
        res.render("edit.ejs", { quote });

    } catch (err) {
        console.log(err)
    }
})
//update data for specific id of compose
router.put('/:id', async (req, res) => {
    try {
        let composeBody = await db.compose.findByPk(req.params.id)
        if (quote.userId !== res.locals.userId) {
            res.render('notauthorized.ejs')
            return
        }
        composeBody.body = req.body.postBody
        composeBody.quote = req.body.quote
        composeBody.author = req.body.author
        composeBody.save()

        res.redirect('/');
    } catch (err) {
        console.log(err)
    }
});

//delete specific posts from db
router.delete("/:id", async (req, res) => {
    try {
        let quote = await db.compose.findByPk(req.params.id)
        if (quote.userId !== res.locals.userId) {
            res.render('notauthorized.ejs')
            return
        }
        await quote.destroy()
        res.redirect("/");

    } catch (err) {
        console.log(err)
    }
})


module.exports = router