import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get user profile
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId).select('-password -cartData')
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, email, phone } = req.body

        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }

        // Check if email is taken by another user
        if (email) {
            const existing = await userModel.findOne({ email, _id: { $ne: userId } })
            if (existing) {
                return res.json({ success: false, message: 'Email is already in use' })
            }
        }

        const updateData = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (phone !== undefined) updateData.phone = phone

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -cartData')
        res.json({ success: true, message: 'Profile updated', user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: 'All fields are required' })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'New password must be at least 8 characters' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Current password is incorrect' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword })
        res.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add address
const addAddress = async (req, res) => {
    try {
        const { userId, type, firstName, lastName, street, city, state, zipcode, country, isDefault } = req.body

        if (!firstName || !lastName || !street || !city || !country) {
            return res.json({ success: false, message: 'Please fill in required fields' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false)
        }

        // If first address, make it default
        if (user.addresses.length === 0) {
            user.addresses.push({ type: type || 'Home', firstName, lastName, street, city, state, zipcode, country, isDefault: true })
        } else {
            user.addresses.push({ type: type || 'Home', firstName, lastName, street, city, state, zipcode, country, isDefault: !!isDefault })
        }

        await user.save()
        res.json({ success: true, message: 'Address added', addresses: user.addresses })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update address
const updateAddress = async (req, res) => {
    try {
        const { userId, addressId, type, firstName, lastName, street, city, state, zipcode, country, isDefault } = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const address = user.addresses.id(addressId)
        if (!address) {
            return res.json({ success: false, message: 'Address not found' })
        }

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false)
        }

        if (type) address.type = type
        if (firstName) address.firstName = firstName
        if (lastName) address.lastName = lastName
        if (street) address.street = street
        if (city) address.city = city
        if (state !== undefined) address.state = state
        if (zipcode !== undefined) address.zipcode = zipcode
        if (country) address.country = country
        if (isDefault !== undefined) address.isDefault = isDefault

        await user.save()
        res.json({ success: true, message: 'Address updated', addresses: user.addresses })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        user.addresses.pull(addressId)
        await user.save()
        res.json({ success: true, message: 'Address deleted', addresses: user.addresses })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update preferences
const updatePreferences = async (req, res) => {
    try {
        const { userId, preferences } = req.body

        const user = await userModel.findByIdAndUpdate(
            userId,
            { preferences },
            { new: true }
        ).select('-password -cartData')

        res.json({ success: true, message: 'Preferences updated', preferences: user.preferences })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, updatePreferences }