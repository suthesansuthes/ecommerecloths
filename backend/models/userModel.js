import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    type: { type: String, default: 'Home' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    country: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    cartData: { type: Object, default: {} },
    addresses: [addressSchema],
    preferences: {
        orderUpdates: { type: Boolean, default: true },
        newArrivals: { type: Boolean, default: true },
        exclusiveOffers: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false }
    }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel