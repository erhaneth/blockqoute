require('dotenv').config()
// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser = require('cookie-parser')
const db = require('./models')
const cryptoJS = require('crypto-js')
const axios = require('axios')
const methodOverride = require("method-override")
// const { randomQuote } = require('quotegarden')

//global variables
// const post = ""

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')


// let allPosts = []

// middle wares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(methodOverride("_method"))

// DIY middleware
// happens on every request
app.use((req, res, next) => {
  //  handy dandy debugging request logger
  console.log(`[${new Date().toLocaleString()}] incoming request: ${req.method} ${req.url}`)
  console.log('request body:', req.body)
  // modify the response to give data to the routes/middleware that is 'downstream'
  res.locals.myData = 'hi, I came from a middleware!'
  // tell express that the middleware is done
  next()
})

// auth middleware
app.use(async (req, res, next) => {
  try {
    // if there is a cookie -- 
    if (req.cookies.userId) {
      // try to find that user in the db
      const userId = req.cookies.userId
      const decryptedId = cryptoJS.AES.decrypt(userId, process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
      const user = await db.user.findByPk(decryptedId)
      // mount the found user on the res.locals so that later routes can access the logged in user
      // any value on the res.locals is available to the layout.ejs
      res.locals.user = user
    } else {
      // the user is explicitly not logged in
      res.locals.user = null
    }
    next()
  } catch (err) {
    console.log(err)
  }
})

// routes
app.get('/', async (req, res) => {
  const allPost = await db.compose.findAll()
 
  res.render('index', {allPosts: allPost})
})

//pulling data from quotable api
app.get('/compose', (req, res) => {
  axios.get(`https://api.quotable.io/random?maxLength=80#`)
    .then(response => {
      res.render('compose.ejs', { quote: response.data })
    })
    .catch(console.log())
})


//redirect the user once the post has been create in db
app.post("/compose", async (req, res) => {
  const allPost = req.body.postBody
  const compose = await db.compose.create({
    body: req.body.postBody,
    quote: req.body.quote
    // userId: res.locals.user.id

  })
  // res.render("home.ejs", { quote: compose.quote, allPosts: allPost });
  res.redirect("/")
});

//show and edit information about specific post
app.get("/compose/:id", async (req, res) => {
  try {
    let quote = await db.compose.findByPk(req.params.id)
    res.render("compose.ejs", { quote });
  } catch (err) {
    console.log(err)
  }
})
//
app.get("/compose/:id/edit", async (req, res) => {
  try {
    let quote = await db.compose.findByPk(req.params.id)
    res.render("edit.ejs", { quote });
  } catch (err) {
    console.log(err)
  }
})
//get comments about a specific quote/compose
app.get("/postpage", async (req, res) => {
  
  try {
    let composeQuote = await db.compose.findByFk(req.params.id)
    res.render("postpage.ejs", {composeQuote });
  } catch (err) {
    console.log(err)
  }
})

//get postpage/:id 
app.get("/postpage/:id", async (req, res) => {
  console.log("postpageID", req.params.id)
  try {
    let composeQuote = await db.compose.findByFk(req.params.id)
    res.render("postpage.ejs", {composeQuote });
  } catch (err) {
    console.log(err)
  }
})

//delete specific posts from db
app.delete("/compose/:id", async(req,res) =>{
  try{
    let quote = await db.compose.findByPk(req.params.id)
    await quote.destroy()
    res.redirect("/");
    
  }catch(err){
    console.log(err)
  }
})
//
// controllers
app.use('/users', require('./controllers/users'))

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})
