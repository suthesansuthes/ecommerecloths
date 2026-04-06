import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const ReviewForm = ({ productId, backendUrl, token, onReviewAdded, onClose }) => {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    if (title.length < 5) {
      toast.error('Title must be at least 5 characters')
      return
    }

    if (comment.length < 10) {
      toast.error('Comment must be at least 10 characters')
      return
    }

    try {
      setLoading(true)
      
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          rating: parseInt(rating),
          title,
          comment,
          userName: 'Valued Customer',
          userEmail: 'customer@store.com'
        },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('✅ Thank you! Your review has been submitted.')
        setRating(5)
        setTitle('')
        setComment('')
        onReviewAdded()
        onClose()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>Share Your Experience</h2>
          <button
            onClick={onClose}
            className='text-2xl hover:text-gray-200 transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Rating */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-3'>
              ⭐ How would you rate this product?
            </label>
            <div className='flex gap-3'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-transform transform hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className='text-sm text-gray-600 mt-2'>
              {[
                'Poor',
                'Fair',
                'Good',
                'Very Good',
                'Excellent'
              ][rating - 1]}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              📝 Review Title *
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., Best quality, loved it!'
              maxLength='100'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
            />
            <p className='text-xs text-gray-500 mt-1'>{title.length}/100</p>
          </div>

          {/* Comment */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              💬 Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your experience with this product...'
              maxLength='1000'
              rows='5'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none'
            />
            <p className='text-xs text-gray-500 mt-1'>{comment.length}/1000</p>
          </div>

          {/* Tips */}
          <div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
            <p className='text-sm font-semibold text-gray-700 mb-2'>💡 Tips for a helpful review:</p>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>✓ Be specific about features you liked or disliked</li>
              <li>✓ Share how the product performs in real use</li>
              <li>✓ Compare with similar products if relevant</li>
              <li>✓ Be honest and respectful</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform disabled:opacity-70 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
                  </svg>
                  Submitting...
                </>
              ) : (
                '✓ Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm
