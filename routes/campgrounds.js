import express from 'express'
import multer from 'multer'

import * as campgrounds from '../controllers/campgrounds.js'
import catchAsync from '../utils/catchAsync.js'
import { isAuthor, isLoggedIn, validateCampground } from '../utils/middleware.js'
import { storage } from '../utils/cloudinaryConfig.js'

const router = express.Router()
const upload = multer({ storage })

router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNew)

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

export default router
