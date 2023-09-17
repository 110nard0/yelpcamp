import express from 'express'

import * as reviews from '../controllers/reviews.js'
import catchAsync from '../utils/catchAsync.js'
import { isLoggedIn, isReviewer, validateReview } from '../utils/middleware.js'

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(reviews.deleteReview))

export default router