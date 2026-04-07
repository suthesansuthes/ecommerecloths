import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    // Email validation with regex
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Real-time validation on blur
    const handleBlur = (field) => {
        setTouched(prev => ({...prev, [field]: true}))
        validateField(field)
    }

    const validateField = (field) => {
        let newErrors = {...errors}
        
        if (field === 'email' || field === 'all') {
            if (!email.trim()) {
                newErrors.email = 'Email is required'
            } else if (!validateEmail(email)) {
                newErrors.email = 'Please enter a valid email'
            } else {
                delete newErrors.email
            }
        }

        if (field === 'password' || field === 'all') {
            if (!password) {
                newErrors.password = 'Password is required'
            } else if (password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters'
            } else {
                delete newErrors.password
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            
            // Validate all fields
            if (!validateField('all')) {
                toast.error('Please fix the errors before submitting')
                return
            }

            setLoading(true)
            const response = await axios.post(backendUrl + '/api/user/admin', {email, password})
            
            if (response.data.success) {
                toast.success('Login successful! Welcome back 👋')
                setToken(response.data.token)
            } else {
                toast.error(response.data.message || 'Login failed')
                setErrors({submit: response.data.message})
            }
             
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || error.message || 'Failed to connect to server'
            toast.error(errorMsg)
            setErrors({submit: errorMsg})
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full p-4' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        {/* Decorative background elements */}
        <div className='absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div className='absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse' style={{animationDelay: '2s'}}></div>

        <div className='relative z-10 w-full max-w-md'>
            {/* Card Container with glass-morphism */}
            <div className='backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10'>
                
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-block p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4'>
                        <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                        </svg>
                    </div>
                    <h1 className='text-3xl font-bold text-white mb-2'>Admin Dashboard</h1>
                    <p className='text-gray-200 text-sm'>Welcome back! Please login to continue</p>
                </div>

                {/* Error Alert */}
                {errors.submit && (
                    <div className='mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3 animate-slideIn'>
                        <svg className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
                        </svg>
                        <div>
                            <p className='text-red-400 text-sm font-medium'>Login Failed</p>
                            <p className='text-red-300 text-xs mt-1'>{errors.submit}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmitHandler} className='space-y-5'>
                    
                    {/* Email Field */}
                    <div className='form-group'>
                        <label className='block text-sm font-semibold text-white mb-2 flex items-center gap-2'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
                            </svg>
                            Email Address
                        </label>
                        <div className='relative'>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (touched.email) validateField('email')
                                }}
                                onBlur={() => handleBlur('email')}
                                placeholder='admin@example.com'
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                                    touched.email && errors.email
                                        ? 'border-red-400/60 focus:bg-red-500/10 focus:border-red-400'
                                        : 'border-white/20 focus:bg-white/10 focus:border-blue-400'
                                }`}
                            />
                            {touched.email && !errors.email && email && (
                                <svg className='absolute right-4 top-3.5 w-5 h-5 text-green-400' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                                </svg>
                            )}
                        </div>
                        {touched.email && errors.email && (
                            <p className='text-red-400 text-xs mt-2 flex items-center gap-1'>
                                <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className='form-group'>
                        <label className='block text-sm font-semibold text-white mb-2 flex items-center gap-2'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' />
                            </svg>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (touched.password) validateField('password')
                                }}
                                onBlur={() => handleBlur('password')}
                                placeholder='••••••••••'
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                                    touched.password && errors.password
                                        ? 'border-red-400/60 focus:bg-red-500/10 focus:border-red-400'
                                        : 'border-white/20 focus:bg-white/10 focus:border-blue-400'
                                }`}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors'
                            >
                                {showPassword ? (
                                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
                                    </svg>
                                ) : (
                                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M11.83 9L15.29 12.46c.04-.32.07-.65.07-1 0-1.66-1.34-3-3-3-.35 0-.68.03-1 .07l2.87 2.87zM7.42 8.59L8.46 9.63C8.15 9.96 7.9 10.35 7.9 10.81 7.9 12.47 9.24 13.81 10.9 13.81c.46 0 .85-.25 1.18-.56l1.04 1.04c-.71.49-1.57.79-2.52.79-2.76 0-5-2.24-5-5 0-.95.3-1.81.79-2.52zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.41L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05-.21-.08-.43-.08-.65 0-1.66 1.34-3 3-3 .22 0 .44.03.65.08l1.55-1.55c-.67-.33-1.41-.53-2.2-.53-2.76 0-5 2.24-5 5 0 .79.2 1.53.53 2.2zM11.84 9.02l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' />
                                    </svg>
                                )}
                            </button>
                            {touched.password && !errors.password && password && (
                                <svg className='absolute right-12 top-3.5 w-5 h-5 text-green-400' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                                </svg>
                            )}
                        </div>
                        {touched.password && errors.password && (
                            <p className='text-red-400 text-xs mt-2 flex items-center gap-1'>
                                <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
                                </svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <>
                                <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
                                    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' 
                                        style={{strokeDasharray: '15.7', strokeDashoffset: 0, animation: 'spin 0.8s linear infinite'}}
                                    ></circle>
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L3.50612381,20.0151496 C3.50612381,20.8006365 4.13399899,21.89 5.03399899,21.89 L20.2899575,21.89 C20.8987722,21.89 21.89,21.1045131 21.89,20.0151496 L21.89,3.98484039 C21.89,2.89547649 20.8987722,2.11 20.2899575,2.11 L5.03399899,2.11 C4.13399899,2.11 3.50612381,3.0993635 3.50612381,3.98484039 L3.03521743,10.4258335 C3.03521743,10.5829309 3.34915502,10.7400283 3.50612381,10.7400283 L16.6915026,11.5255151 C16.6915026,11.5255151 17.1624089,11.5255151 17.1624089,12.0000225 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z' />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Demo Credentials Info */}
                <div className='mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg'>
                    <p className='text-xs text-blue-300 font-semibold mb-2 flex items-center gap-2'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
                        </svg>
                        Demo Credentials
                    </p>
                    <p className='text-xs text-blue-200'>Email: <span className='font-mono font-semibold'>admin@example.com</span></p>
                    <p className='text-xs text-blue-200'>Password: <span className='font-mono font-semibold'>greatstack123</span></p>
                </div>
            </div>

            {/* Footer */}
            <p className='text-center text-gray-300 text-xs mt-6'>🔒 Secure admin login with JWT authentication</p>
        </div>
    </div>
  )
}

export default Login