import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import ReviewForm from './ReviewForm'
import ReviewDisplay from './ReviewDisplay'

const ReviewsSection = ({ productId }) => {
  const { backendUrl, token, navigate } = useContext(ShopContext)
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [showForm, setShowForm] = useState(false)
  const [ratingFilter, setRatingFilter] = useState('all')

  // Fetch reviews and stats
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${backendUrl}/api/review/product/${productId}?sort=${sortBy}&page=1&limit=10`
      )

      if (response.data.success) {
        setReviews(response.data.reviews)
        setStats({
          avgRating: response.data.avgRating,
          totalReviews: response.data.totalReviews,
          ratingDistribution: response.data.ratingDistribution
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy])

  const handleWriteReview = () => {
    if (!token) {
      toast.info('Please login to write a review')
      navigate('/login')
      return
    }
    setShowForm(true)
  }

  const filteredReviews = ratingFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(ratingFilter))

  // Rating bar component
  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0
    return (
      <div className='flex items-center gap-3'>
        <span className='text-sm font-semibold text-gray-700 w-12'>{rating}★</span>
        <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-yellow-400 transition-all duration-300'
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className='text-sm text-gray-600 w-12 text-right'>({count})</span>
      </div>
    )
  }

  return (
    <div className='py-12 border-t border-gray-200'>
      <h2 className='text-3xl font-bold text-gray-900 mb-8'>Customer Reviews & Ratings</h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        
        {/* Reviews Stats - Left Side */}
        <div className='lg:col-span-1'>
          <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100'>
            
            {/* Overall Rating */}
            <div className='text-center mb-8 pb-8 border-b border-yellow-200'>
              <div className='text-5xl font-bold text-gray-900 mb-2'>
                {stats.avgRating || '0.0'}
              </div>
              <div className='flex justify-center gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(stats.avgRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className='text-sm text-gray-600'>
                Based on {stats.totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className='space-y-4 mb-8'>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating === ratingFilter ? 'all' : rating)}
                  className={`w-full transition-all ${
                    ratingFilter === rating
                      ? 'opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <RatingBar
                    rating={rating}
                    count={stats.ratingDistribution[rating]}
                    total={stats.totalReviews}
                  />
                </button>
              ))}
            </div>

            {/* Write Review Button */}
            <button
              onClick={handleWriteReview}
              className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform'
            >
              ✍️ Write a Review
            </button>
          </div>
        </div>

        {/* Reviews List - Right Side */}
        <div className='lg:col-span-2'>
          
          {/* Sort/Filter Controls */}
          <div className='flex items-center justify-between mb-6 pb-6 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900'>
              {filteredReviews.length} Reviews
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm font-semibold'
            >
              <option value='recent'>Most Recent</option>
              <option value='helpful'>Most Helpful</option>
              <option value='rating-high'>Highest Rating</option>
              <option value='rating-low'>Lowest Rating</option>
            </select>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className='flex justify-center py-12'>
              <svg className='w-12 h-12 animate-spin text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
              </svg>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className='space-y-6'>
              {filteredReviews.map(review => (
                <ReviewDisplay
                  key={review._id}
                  review={review}
                  backendUrl={backendUrl}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-600 text-lg mb-4'>
                {ratingFilter !== 'all'
                  ? `No reviews with ${ratingFilter} stars yet.`
                  : 'No reviews yet. Be the first to review!'}
              </p>
              <button
                onClick={handleWriteReview}
                className='inline-block py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
              >
                Write First Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          productId={productId}
          backendUrl={backendUrl}
          token={token}
          onReviewAdded={fetchReviews}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default ReviewsSection
