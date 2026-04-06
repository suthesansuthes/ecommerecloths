import newsletterModel from '../models/newsletterModel.js'

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        // Check if email already exists
        const existingEmail = await newsletterModel.findOne({ email })
        if (existingEmail) {
            return res.json({ success: false, message: 'Email already subscribed' })
        }

        // Create new newsletter subscription
        const newSubscription = new newsletterModel({ email })
        await newSubscription.save()

        res.json({ success: true, message: 'Successfully subscribed to our newsletter!' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Unsubscribe from newsletter
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        const result = await newsletterModel.findOneAndDelete({ email })
        
        if (!result) {
            return res.json({ success: false, message: 'Email not found in our list' })
        }

        res.json({ success: true, message: 'Successfully unsubscribed from newsletter' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all newsletter subscribers (admin only)
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletterModel.find({ isActive: true }).select('email subscribedAt')
        res.json({ success: true, count: subscribers.length, subscribers })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { subscribeNewsletter, unsubscribeNewsletter, getAllSubscribers }
