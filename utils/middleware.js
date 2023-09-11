export const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnUrl = req.originalUrl
		req.flash('error', 'You must be signed in first!')
		return res.redirect('/login')
	}
	next()
}

export const storeReturnUrl = (req, res, next) => {
	if (req.session.returnUrl) {
		res.locals.returnUrl = req.session.returnUrl
	}
	next()
}