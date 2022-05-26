const express = require('express')
const router = express.Router()

// GET /users/new -- renders a form to create a new user
router.get('/new', (req, res) => {
	res.render('users/new.ejs')
})

// POST /users -- creates a new user and redirects to index
router.post('/', (req, res) => {
	res.send('one day, i will make a new user')
})

module.exports = router