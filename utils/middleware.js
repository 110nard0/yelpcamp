import AppError from './AppError.js'
import Campground from '../models/campground.js'
import Review from '../models/review.js'
import { campgroundSchema, reviewSchema } from './schema.js'

export const isAuthor = async (req, res, next) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!')
		return res.redirect(`/campgrounds/${id}`)
	}
	next()
}

export const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnUrl = req.originalUrl
		req.flash('error', 'You must be signed in first!')
		return res.redirect('/login')
	}
	next()
}

export const isReviewer = async (req, res, next) => {
	const { id, reviewId } = req.params
	const review = await Review.findById(reviewId)
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!')
		return res.redirect(`/campgrounds/${id}`)
	}
	next()
}

export const storeReturnUrl = (req, res, next) => {
	if (req.session.returnUrl) {
		res.locals.returnUrl = req.session.returnUrl
	}
	next()
}

export const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(elem => elem.message).join(',')
		throw new AppError(400, msg)
	} else {
		next()
	}
}

export const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(elem => elem.message).join(',')
		throw new AppError(400, msg)
	} else {
		next()
	}
}