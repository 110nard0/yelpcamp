import express from 'express'
import passport from 'passport'

import catchAsync from '../utils/catchAsync.js'
import { storeReturnUrl } from '../utils/middleware.js'
import User from '../models/user.js'

const router = express.Router()

router.get('/register', (req, res) => {
	res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
	try {
		const { email, username, password } = req.body.user
		const user = new User({ email, username })
		const registeredUser = await User.register(user, password)
		req.login(registeredUser, err => {
			if (err) return next(err)
			req.flash('success', 'Welcome to Yelp Camp!')
			res.redirect('/campgrounds')
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/register')
	}
}))

router.get('/login', (req, res) => {
	res.render('users/login')
})

router.post('/login', storeReturnUrl,
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}),
	(req, res) => {
		req.flash('success', 'Welcome back to Yelp Camp!')
		const redirectUrl = res.locals.returnUrl || '/campgrounds'
		res.redirect(redirectUrl)
	})

router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) return next(err)
		req.flash('success', 'Goodbye from Yelp Camp!')
		res.redirect('/campgrounds')
	})
})

export default router