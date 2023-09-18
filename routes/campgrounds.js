import express from 'express'

import * as campgrounds from '../controllers/campgrounds.js'
import catchAsync from '../utils/catchAsync.js'
import { isAuthor, isLoggedIn, validateCampground } from '../utils/middleware.js'

const router = express.Router()

router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNew)

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

export default router