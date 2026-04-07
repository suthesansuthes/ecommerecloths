import React, { useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (response.data.success) {
        setSent(true)
        toast.success('Reset link sent! Check your email.')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 sm:px-8 text-white text-center'>
            <div className='text-5xl mb-3'>🔑</div>
            <h1 className='text-2xl sm:text-3xl font-bold mb-2'>Forgot Password?</h1>
            <p className='text-blue-100 text-sm'>No worries, we'll send you a reset link</p>
          </div>

          <div className='px-6 py-8 sm:px-8'>
            {!sent ? (
              <form onSubmit={handleSubmit}>
                <div className='mb-6'>
                  <label className='block text-sm font-semibold text-gray-700 mb-3'>📧 Email Address</label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='kamal@gmail.com'
                    required
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900'
                  />
                  <p className='text-xs text-gray-500 mt-2'>Enter the email address associated with your account</p>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform disabled:opacity-70 flex items-center justify-center gap-2 mb-4'
                >
                  {loading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Sending...
                    </>
                  ) : '📧 Send Reset Link'}
                </button>

                <button
                  type='button'
                  onClick={() => navigate('/login')}
                  className='w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                >
                  ← Back to Login
                </button>
              </form>
            ) : (
              <div className='text-center'>
                <div className='text-6xl mb-4'>✉️</div>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>Check Your Email</h2>
                <p className='text-gray-600 mb-2'>We've sent a password reset link to:</p>
                <p className='font-semibold text-blue-600 mb-6'>{email}</p>
                <div className='bg-blue-50 rounded-lg p-4 text-sm text-gray-700 space-y-2 border border-blue-100 mb-6'>
                  <p>💡 <strong>Didn't receive the email?</strong></p>
                  <p>• Check your spam/junk folder</p>
                  <p>• Make sure the email address is correct</p>
                  <p>• The link expires in 1 hour</p>
                </div>
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  className='w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors mb-3'
                >
                  Try Another Email
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className='w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                >
                  ← Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
