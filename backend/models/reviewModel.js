import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        ref: 'product'
    },
    userId: {
        type: String,
        required: true,
        ref: 'user'
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        default: 'customer@store.com'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    verified: {
        type: Boolean,
        default: false // Set true if user purchased the product
    },
    helpful: {
        type: Number,
        default: 0 // Count of helpful votes
    },
    unhelpful: {
        type: Number,
        default: 0 // Count of unhelpful votes
    },
    approved: {
        type: Boolean,
        default: true // Can be set to false for moderation
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Index for faster queries
reviewSchema.index({ productId: 1, approved: 1 })
reviewSchema.index({ userId: 1 })
reviewSchema.index({ createdAt: -1 })

const reviewModel = mongoose.model('review', reviewSchema)

export default reviewModel
