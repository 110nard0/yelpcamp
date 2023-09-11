import express from 'express'

import Campground from '../models/campground.js'
import catchAsync from '../utils/catchAsync.js'
import { isAuthor, isLoggedIn, validateCampground } from '../utils/middleware.js'

const router = express.Router()

router.get('/', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
	const campground = new Campground(req.body.campground)
	campground.author = req.user._id
	await campground.save()
	req.flash('success', 'Successfully created new campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate('author').populate({
		path: 'reviews',
		populate: {
			path: 'author'
		}
	})
	if (!campground) {
		req.flash('error', 'Cannot find campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	if (!campground) {
		req.flash('error', 'Cannot find campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
	req.flash('success', 'Successfully updated campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id)
	req.flash('success', 'Successfully deleted campground!')
	res.redirect('/campgrounds')
}))

export default router
