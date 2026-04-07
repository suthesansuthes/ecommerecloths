import express from 'express';
import { loginUser, registerUser, adminLogin, getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, updatePreferences, forgotPassword, resetPassword } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

// Profile routes (authenticated)
userRouter.post('/profile', authUser, getProfile)
userRouter.put('/profile', authUser, updateProfile)
userRouter.put('/password', authUser, changePassword)

// Address routes (authenticated)
userRouter.post('/address', authUser, addAddress)
userRouter.put('/address', authUser, updateAddress)
userRouter.delete('/address', authUser, deleteAddress)

// Preferences routes (authenticated)
userRouter.put('/preferences', authUser, updatePreferences)

export default userRouter;