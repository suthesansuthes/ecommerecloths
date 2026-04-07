import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const [showPassword, setShowPassword] = useState(false)
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPasword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          
          const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        }


      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(()=>{
    if (token) {
      // Check if there's a redirect path stored (e.g., from checkout page)
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      localStorage.removeItem('redirectAfterLogin') // Clear the stored path
      
      if (redirectPath) {
        navigate(redirectPath)
      } else {
        navigate('/')
      }
    }
  },[token])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-md'>
        {/* Card Container */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 sm:px-8 text-white'>
            <h1 className='text-3xl sm:text-4xl font-bold mb-2'>
              {currentState === 'Login' ? '👋 Welcome Back' : '🎉 Join Us'}
            </h1>
            <p className='text-blue-100 text-sm'>
              {currentState === 'Login' 
                ? 'Sign in to your account to continue' 
                : 'Create an account to start shopping'}
            </p>
          </div>

          {/* Form Content */}
          <div className='px-6 py-8 sm:px-8'>
            
            {/* Name Field - Only for Sign Up */}
            {currentState === 'Sign Up' && (
              <div className='mb-6 animate-fadeIn'>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>
                  👤 Full Name
                </label>
                <input 
                  onChange={(e)=>setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  placeholder='Kamal Perera'
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900'
                />
              </div>
            )}

            {/* Email Field */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-700 mb-3'>
                📧 Email Address
              </label>
              <input 
                onChange={(e)=>setEmail(e.target.value)} 
                value={email} 
                type="email" 
                placeholder='kamal@gmail.com'
                required
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900'
              />
            </div>

            {/* Password Field */}
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-700 mb-3'>
                🔒 Password
              </label>
              <div className='relative'>
                <input 
                  onChange={(e)=>setPasword(e.target.value)} 
                  value={password} 
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900 pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Forgot Password / Toggle Link */}
            <div className='flex justify-between items-center mb-8 text-sm'>
              {currentState === 'Login' && (
                <a href="#" className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'>
                  Forgot your password?
                </a>
              )}
              <button
                type='button'
                onClick={() => {
                  setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')
                  setName('')
                  setEmail('')
                  setPasword('')
                }}
                className={`font-semibold transition-colors ${
                  currentState === 'Login'
                    ? 'text-blue-600 hover:text-blue-700'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {currentState === 'Login' 
                  ? 'Create account' 
                  : 'Login Here'}
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type='submit'
              className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform mb-4'
            >
              {currentState === 'Login' ? '🔓 Sign In' : '✨ Create Account'}
            </button>

            {/* Trust Info */}
            <div className='bg-blue-50 rounded-lg p-4 text-sm text-gray-700 space-y-2 border border-blue-100'>
              <p className='flex items-center gap-2'>
                <span>🔐</span>
                <span><strong>Secure:</strong> Your data is encrypted</span>
              </p>
              <p className='flex items-center gap-2'>
                <span>⚡</span>
                <span><strong>Fast:</strong> Instant account setup</span>
              </p>
              <p className='flex items-center gap-2'>
                <span>✨</span>
                <span><strong>Easy:</strong> No hidden fees</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-gray-600 text-sm mt-6'>
          By {currentState === 'Login' ? 'signing in' : 'creating an account'}, you agree to our
          <a href="#" className='text-blue-600 hover:text-blue-700 font-semibold'> Terms & Conditions</a>
        </p>
      </form>
    </div>
  )
}

export default Login
