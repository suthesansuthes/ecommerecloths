import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const NewsletterBox = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { backendUrl } = useContext(ShopContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (email) {
            setLoading(true)
            try {
                const response = await axios.post(backendUrl + '/api/newsletter/subscribe', { email })
                if (response.data.success) {
                    toast.success(response.data.message);
                    setEmail('');
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error('Failed to subscribe. Please try again.')
            } finally {
                setLoading(false)
            }
        } else {
            toast.error('Please enter your email')
        }
    }

  return (
    <div className='bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 md:p-12 my-16 border border-gray-200'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          <div className='bg-yellow-100 p-3 rounded-full'>
            <svg className='w-6 h-6 text-yellow-600' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M2.5 3A1.5 1.5 0 001 4.5v.006c0 .213.03.426.088.632l1.988 6.54A1.5 1.5 0 005.75 13h8.5a1.5 1.5 0 001.362-.817l2.477-4.954.088-.177.089-.177v-.007A1.5 1.5 0 0015.5 5h-13zm6 2a.5.5 0 11-1 0 .5.5 0 011 0z' />
            </svg>
          </div>
        </div>
        
        <h2 className='mb-2'>
          Exclusive Offers Await
        </h2>
        
        <p className='text-gray-600 mb-6 max-w-md mx-auto'>
          Subscribe to our newsletter and get 20% off your first order. Plus, stay updated on new collections and special promotions.
        </p>

        <form onSubmit={onSubmitHandler} className='max-w-md mx-auto'>
          <div className='flex flex-col sm:flex-row gap-2'>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm'
              type="email"
              placeholder='Enter your email address'
              required
            />
            <button
              type='submit'
              disabled={loading}
              className='btn-primary px-6 py-3 whitespace-nowrap text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-3'>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  )
}

export default NewsletterBox
