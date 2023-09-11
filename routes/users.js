import express from 'express'

import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'
import User from '../models/user.js'

const router = express.Router()

router.get('/register', (req, res) => {
	res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
	try {
		const { email, username, password } = req.body.user
		const user = new User({ email, username })
		const registeredUser = await User.register(user, password)
		req.flash('success', 'Welcome to Yelp Camp!')
		res.redirect('/campgrounds')
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/register')
	}
}))

export default router