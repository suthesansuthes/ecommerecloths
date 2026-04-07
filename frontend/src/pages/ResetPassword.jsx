import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {
  const { token } = useParams()
  const { backendUrl, navigate } = useContext(ShopContext)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill in both fields')
    }
    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/user/reset-password', {
        token,
        newPassword
      })

      if (response.data.success) {
        setSuccess(true)
        toast.success('Password reset successfully!')
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
            <div className='text-5xl mb-3'>{success ? '✅' : '🔒'}</div>
            <h1 className='text-2xl sm:text-3xl font-bold mb-2'>
              {success ? 'Password Reset!' : 'Set New Password'}
            </h1>
            <p className='text-blue-100 text-sm'>
              {success ? 'Your password has been updated' : 'Choose a strong password for your account'}
            </p>
          </div>

          <div className='px-6 py-8 sm:px-8'>
            {!success ? (
              <form onSubmit={handleSubmit}>
                <div className='mb-5'>
                  <label className='block text-sm font-semibold text-gray-700 mb-3'>🔒 New Password</label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder='At least 8 characters'
                      required
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900 pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {newPassword && newPassword.length < 8 && (
                    <p className='text-red-500 text-xs mt-1'>Password must be at least 8 characters</p>
                  )}
                  {newPassword && newPassword.length >= 8 && (
                    <p className='text-green-600 text-xs mt-1'>✓ Good password length</p>
                  )}
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-semibold text-gray-700 mb-3'>🔒 Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Re-enter your password'
                    required
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-gray-900'
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className='text-red-500 text-xs mt-1'>Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                    <p className='text-green-600 text-xs mt-1'>✓ Passwords match</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform disabled:opacity-70 flex items-center justify-center gap-2 mb-4'
                >
                  {loading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Resetting...
                    </>
                  ) : '🔐 Reset Password'}
                </button>

                <div className='bg-blue-50 rounded-lg p-4 text-sm text-gray-700 space-y-1 border border-blue-100'>
                  <p className='font-semibold'>Password requirements:</p>
                  <p className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </p>
                </div>
              </form>
            ) : (
              <div className='text-center'>
                <div className='text-6xl mb-4'>🎉</div>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>All Done!</h2>
                <p className='text-gray-600 mb-6'>Your password has been reset successfully. You can now log in with your new password.</p>
                <button
                  onClick={() => navigate('/login')}
                  className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform'
                >
                  🔓 Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
