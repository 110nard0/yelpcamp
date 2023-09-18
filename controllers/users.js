import User from '../models/user.js'

export const renderRegister = (req, res) => {
	res.render('users/register')
}

export const registerUser = async (req, res, next) => {
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
}

export const renderLogin = (req, res) => {
	res.render('users/login')
}

export const loginUser = (req, res) => {
	req.flash('success', 'Welcome back to Yelp Camp!')
	const redirectUrl = res.locals.returnUrl || '/campgrounds'
	res.redirect(redirectUrl)
}

export const logoutUser = (req, res) => {
	req.logout((err) => {
		if (err) return next(err)
		req.flash('success', 'Goodbye from Yelp Camp!')
		res.redirect('/campgrounds')
	})
}