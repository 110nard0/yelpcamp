import Campground from '../models/campground.js'

export const index = async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}

export const renderNew = (req, res) => {
	res.render('campgrounds/new')
}

export const createCampground = async (req, res, next) => {
	const campground = new Campground(req.body.campground)
	campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }))
	campground.author = req.user._id
	await campground.save()
	req.flash('success', 'Successfully created new campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}

export const showCampground = async (req, res) => {
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
}

export const renderEdit = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	if (!campground) {
		req.flash('error', 'Cannot find campground!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}

export const updateCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
	req.flash('success', 'Successfully updated campground!')
	res.redirect(`/campgrounds/${campground._id}`)
}

export const deleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id)
	req.flash('success', 'Successfully deleted campground!')
	res.redirect('/campgrounds')
}