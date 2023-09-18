import express from 'express'

import * as campgrounds from '../controllers/campgrounds.js'
import catchAsync from '../utils/catchAsync.js'
import { isAuthor, isLoggedIn, validateCampground } from '../utils/middleware.js'

const router = express.Router()

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNew)

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

router.put('/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(campgrounds.updateCampground)
)

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

export default router