import express from 'express'

import AppError from '../utils/AppError.js'
import Campground from '../models/campground.js'
import catchAsync from '../utils/catchAsync.js'
import { isLoggedIn } from '../utils/middleware.js'
import Review from '../models/review.js'
import { reviewSchema } from '../schemas/schema.js'

const router = express.Router({ mergeParams: true })

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(elem => elem.message).join(',')
		throw new AppError(400, msg)
	} else {
		next()
	}
}

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	const review = new Review(req.body.review)
	review.camp = campground._id
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	req.flash('success', 'Successfully created new review!')
	res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
	const { id, reviewId } = req.params
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', 'Successfully deleted review!')
	res.redirect(`/campgrounds/${id}`)
}))

export default router