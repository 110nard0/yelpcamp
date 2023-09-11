import express from 'express'

import Campground from '../models/campground.js'
import catchAsync from '../utils/catchAsync.js'
import Review from '../models/review.js'
import { isLoggedIn, isReviewer, validateReview } from '../utils/middleware.js'

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	const review = new Review(req.body.review)
	review.author = req.user._id
	review.camp = campground._id
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	req.flash('success', 'Successfully created new review!')
	res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(async (req, res) => {
	const { id, reviewId } = req.params
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', 'Successfully deleted review!')
	res.redirect(`/campgrounds/${id}`)
}))

export default router