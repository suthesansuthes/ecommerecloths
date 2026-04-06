import mongoose from 'mongoose'

const filterOptionsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['brand', 'color', 'material'],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: ''
    },
    colorCode: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Index for faster queries
filterOptionsSchema.index({ type: 1, active: 1 })
filterOptionsSchema.index({ name: 1, type: 1 })

const filterOptionsModel = mongoose.model('filterOptions', filterOptionsSchema)

export default filterOptionsModel
