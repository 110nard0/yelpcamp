import express from 'express'
import passport from 'passport'

import * as users from '../controllers/users.js'
import catchAsync from '../utils/catchAsync.js'
import { storeReturnUrl } from '../utils/middleware.js'

const router = express.Router()

router.route('/register')
	.get(users.renderRegister)
	.post(catchAsync(users.registerUser))

router.route('/login')
	.get(users.renderLogin)
	.post(
		storeReturnUrl,
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login'
		}),
		users.loginUser)

router.get('/logout', users.logoutUser)

export default router