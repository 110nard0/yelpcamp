import express from 'express'
import passport from 'passport'

import * as users from '../controllers/users.js'
import catchAsync from '../utils/catchAsync.js'
import { storeReturnUrl } from '../utils/middleware.js'

const router = express.Router()

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLogin)

router.post('/login',
	storeReturnUrl,
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}),
	users.loginUser)

router.get('/logout', users.logoutUser)

export default router