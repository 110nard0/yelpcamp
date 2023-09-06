import express from 'express'

import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

import Campground from '../models/campground.js'
import { campgroundSchema } from '../schemas/schema.js'

const router = express.Router()

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const msg = error.details.map(elem => elem.message).join(',')
		throw new AppError(400, msg)
	} else {
		next()
	}
}

router.get('/', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
	res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
	const campground = new Campground(req.body.campground)
	await campground.save()
	req.flash('success', 'Successfully created new campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate('reviews')
	if (!campground) {
		req.flash('error', 'Cannot find campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	if (!campground) {
		req.flash('error', 'Cannot find campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })
	req.flash('success', 'Successfully updated campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id)
	req.flash('success', 'Successfully deleted campground!')
	res.redirect('/campgrounds')
}))

export default router
