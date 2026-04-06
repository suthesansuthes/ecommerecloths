import express from 'express'
import { addReview, getProductReviews, getReviewStats, markHelpful, deleteReview, getAllReviews, approveReview } from '../controllers/reviewController.js'
import authUser from '../middleware/auth.js'

const reviewRouter = express.Router()

// Public routes
reviewRouter.get('/product/:productId', getProductReviews)
reviewRouter.get('/stats/:productId', getReviewStats)

// User routes (requires authentication)
reviewRouter.post('/add', authUser, addReview)
reviewRouter.put('/helpful/:reviewId', authUser, markHelpful)

// Admin routes (can be enhanced with admin middleware)
reviewRouter.get('/admin/all', getAllReviews)
reviewRouter.delete('/:reviewId', authUser, deleteReview)
reviewRouter.put('/approve/:reviewId', approveReview)

export default reviewRouter
