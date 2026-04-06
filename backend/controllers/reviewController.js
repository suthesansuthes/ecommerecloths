import reviewModel from '../models/reviewModel.js'

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body
        const userId = req.body.userId
        const userEmail = req.body.userEmail || 'customer@store.com'
        const userName = req.body.userName || 'Anonymous'

        // Validation
        if (!productId || !rating || !title || !comment) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' })
        }

        // Check if user already reviewed this product
        const existingReview = await reviewModel.findOne({ productId, userId })
        if (existingReview) {
            return res.json({ success: false, message: 'You have already reviewed this product' })
        }

        // Create new review
        const review = new reviewModel({
            productId,
            userId,
            userName,
            userEmail,
            rating: parseInt(rating),
            title,
            comment,
            verified: true // In production, verify from order history
        })

        await review.save()
        res.json({ success: true, message: 'Review added successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const { sort = 'recent', page = 1, limit = 5 } = req.query

        let sortOption = { createdAt: -1 } // Default: most recent

        if (sort === 'helpful') {
            sortOption = { helpful: -1, createdAt: -1 }
        } else if (sort === 'rating-high') {
            sortOption = { rating: -1, createdAt: -1 }
        } else if (sort === 'rating-low') {
            sortOption = { rating: 1, createdAt: -1 }
        }

        const skip = (page - 1) * limit

        const reviews = await reviewModel
            .find({ productId, approved: true })
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))

        const totalReviews = await reviewModel.countDocuments({ productId, approved: true })

        // Calculate average rating and distribution
        const allReviews = await reviewModel.find({ productId, approved: true })
        
        let avgRating = 0
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
            avgRating = (totalRating / allReviews.length).toFixed(1)
            
            allReviews.forEach(review => {
                ratingDistribution[review.rating]++
            })
        }

        res.json({
            success: true,
            reviews,
            totalReviews,
            pages: Math.ceil(totalReviews / limit),
            currentPage: parseInt(page),
            avgRating: parseFloat(avgRating),
            ratingDistribution
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get review stats for a product
const getReviewStats = async (req, res) => {
    try {
        const { productId } = req.params

        const reviews = await reviewModel.find({ productId, approved: true })

        if (reviews.length === 0) {
            return res.json({
                success: true,
                avgRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            })
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const avgRating = (totalRating / reviews.length).toFixed(1)

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.forEach(review => {
            ratingDistribution[review.rating]++
        })

        res.json({
            success: true,
            avgRating: parseFloat(avgRating),
            totalReviews: reviews.length,
            ratingDistribution
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Mark review as helpful
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params
        const { helpful = true } = req.body

        let update
        if (helpful) {
            update = { $inc: { helpful: 1 } }
        } else {
            update = { $inc: { unhelpful: 1 } }
        }

        await reviewModel.findByIdAndUpdate(reviewId, update)

        res.json({ success: true, message: 'Thank you for your feedback' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete review (admin)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params

        await reviewModel.findByIdAndDelete(reviewId)

        res.json({ success: true, message: 'Review deleted successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all reviews (admin)
const getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, approved = null } = req.query

        let filter = {}
        if (approved !== null) {
            filter.approved = approved === 'true'
        }

        const skip = (page - 1) * limit

        const reviews = await reviewModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        const total = await reviewModel.countDocuments(filter)

        res.json({
            success: true,
            reviews,
            total,
            pages: Math.ceil(total / limit)
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Approve review (admin)
const approveReview = async (req, res) => {
    try {
        const { reviewId } = req.params

        await reviewModel.findByIdAndUpdate(reviewId, { approved: true })

        res.json({ success: true, message: 'Review approved successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    addReview,
    getProductReviews,
    getReviewStats,
    markHelpful,
    deleteReview,
    getAllReviews,
    approveReview
}
