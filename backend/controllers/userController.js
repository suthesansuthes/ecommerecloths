import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
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

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            // Don't reveal if email exists
            return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' })
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        user.resetToken = hashedToken
        user.resetTokenExpiry = Date.now() + 3600000 // 1 hour
        await user.save()

        // Build reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        await transporter.sendMail({
            from: `"Forever Store" <${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p style="color: #374151; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
                        <p style="color: #6b7280; font-size: 14px;">We received a request to reset your password. Click the button below to set a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">This link will expire in <strong>1 hour</strong>.</p>
                        <p style="color: #6b7280; font-size: 13px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Forever Store — Premium Fashion & Lifestyle</p>
                    </div>
                </div>
            `
        })

        res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Failed to send reset email. Please try again later.' })
    }
}

// Reset password with token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.json({ success: false, message: 'Token and new password are required' })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' })
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await userModel.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset link. Please request a new one.' })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.json({ success: true, message: 'Password reset successfully! You can now login.' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, updatePreferences, forgotPassword, resetPassword }