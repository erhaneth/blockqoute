const express = require('express')
const router = express.Router()
const db = require('../models')

// GET /users/new -- renders a form to create a new user
router.get('/new', (req, res) => {
	res.render('users/new.ejs', { msg: null })
})

// POST /users -- creates a new user and redirects to index
router.post('/', async (req, res) => {
	try {
		// try to create the user
		// TODO: hash password
		const [user, created] = await db.user.findOrCreate({
			where: { email: req.body.email },
			defaults: { password: req.body.password }
		})

		// if the user is new
		if (created) {
			// login them in by giving them cookie
			// res.cookie('cookie name', cookie data)
			// TODO: encrypt id
			res.cookie('userId', user.id)
			// redirect to the homepage (in the future this could redirect elsewhere)
			res.redirect('/')
		} else {
		// if the user was not created
			// re render the login form with a message for the user
			console.log('that email already exists')
			res.render('users/new.ejs', { msg: 'email exists in database already 🤦‍♂️' })
		}
	} catch (err) {
		console.log(err)
	}
})

module.exports = router