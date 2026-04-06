import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ReviewDisplay = ({ review, backendUrl, onHelpful }) => {
  const { token } = useContext(ShopContext)
  const [helpful, setHelpful] = useState(false)
  const [unhelpful, setUnhelpful] = useState(false)
  const [helpCount, setHelpCount] = useState(review.helpful || 0)
  const [unhelpCount, setUnhelpCount] = useState(review.unhelpful || 0)

  const handleHelpful = async (isHelpful) => {
    if (!token) {
      toast.info('Please login to vote')
      return
    }

    if (isHelpful && helpful) return
    if (!isHelpful && unhelpful) return

    try {
      const response = await axios.put(
        `${backendUrl}/api/review/helpful/${review._id}`,
        { helpful: isHelpful },
        { headers: { token } }
      )

      if (response.data.success) {
        if (isHelpful) {
          setHelpful(true)
          setUnhelpful(false)
          setHelpCount(helpCount + 1)
          if (unhelpful) setUnhelpCount(unhelpCount - 1)
        } else {
          setUnhelpful(true)
          setHelpful(false)
          setUnhelpCount(unhelpCount + 1)
          if (helpful) setHelpCount(helpCount - 1)
        }
        toast.success('Thank you for your feedback!')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to save feedback')
    }
  }

  const formatDate = (date) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diff = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24))
    
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`
    if (diff < 365) return `${Math.floor(diff / 30)} months ago`
    return `${Math.floor(diff / 365)} years ago`
  }

  return (
    <div className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white'>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          {/* Rating */}
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className='font-bold text-gray-900'>{review.rating}.0</span>
          </div>

          {/* Title */}
          <h4 className='font-bold text-gray-900 mb-2 text-lg'>{review.title}</h4>

          {/* Author Info */}
          <div className='flex items-center gap-2 text-sm'>
            <span className='font-semibold text-gray-700'>{review.userName || 'Anonymous'}</span>
            {review.verified && (
              <span className='bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1'>
                ✓ Verified
              </span>
            )}
            <span className='text-gray-500'>•</span>
            <span className='text-gray-600'>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className='text-gray-700 leading-relaxed mb-6'>{review.comment}</p>

      {/* Helpful Section */}
      <div className='flex items-center gap-6 pt-4 border-t border-gray-200'>
        <span className='text-sm text-gray-600 font-semibold'>Was this helpful?</span>
        <div className='flex gap-3'>
          <button
            onClick={() => handleHelpful(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
              helpful
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            👍 {helpCount > 0 && helpCount}
          </button>
          <button
            onClick={() => handleHelpful(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
              unhelpful
                ? 'bg-red-100 text-red-700 border-2 border-red-400'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            👎 {unhelpCount > 0 && unhelpCount}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewDisplay
