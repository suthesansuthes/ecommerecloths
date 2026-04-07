import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='py-12 sm:py-16 md:py-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10 sm:mb-16'>
          <h2 className='mb-2 sm:mb-3'>Why Shop With Us?</h2>
          <p className='text-gray-600 text-sm sm:text-lg'>Experience the difference with our customer-first approach</p>
        </div>

        {/* Horizontally scrollable on mobile, grid on md+ */}
        <div className='flex md:grid md:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide'>
          <div className='group min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center'>
            <div className='bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full hover:border-gray-200'>
              <div className='inline-block p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4 sm:mb-6 text-2xl sm:text-4xl transform group-hover:scale-110 transition-transform'>🔄</div>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3' style={{fontFamily: 'Outfit, sans-serif', letterSpacing: '0'}}>Easy Exchange</h3>
              <p className='text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4'>We offer hassle-free exchange policy for all products</p>
              <div className='h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300'></div>
            </div>
          </div>

          <div className='group min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center'>
            <div className='bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full hover:border-gray-200'>
              <div className='inline-block p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 sm:mb-6 text-2xl sm:text-4xl transform group-hover:scale-110 transition-transform'>📦</div>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3' style={{fontFamily: 'Outfit, sans-serif', letterSpacing: '0'}}>7 Days Return</h3>
              <p className='text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4'>We provide 7 days free return policy on all items</p>
              <div className='h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300'></div>
            </div>
          </div>

          <div className='group min-w-[75vw] sm:min-w-[60vw] md:min-w-0 snap-center'>
            <div className='bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full hover:border-gray-200'>
              <div className='inline-block p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4 sm:mb-6 text-2xl sm:text-4xl transform group-hover:scale-110 transition-transform'>💬</div>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3' style={{fontFamily: 'Outfit, sans-serif', letterSpacing: '0'}}>24/7 Support</h3>
              <p className='text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4'>We provide round-the-clock customer support for your queries</p>
              <div className='h-1 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300'></div>
            </div>
          </div>
        </div>

        <div className='mt-10 sm:mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 md:p-12 border border-blue-100'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center'>
            <div>
              <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2'>100%</p>
              <p className='text-gray-700 font-medium text-xs sm:text-base'>Original Products</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1 sm:mb-2'>🚚</p>
              <p className='text-gray-700 font-medium text-xs sm:text-base'>Fast Shipping</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2'>✅</p>
              <p className='text-gray-700 font-medium text-xs sm:text-base'>Secure Payment</p>
            </div>
            <div>
              <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2'>🎁</p>
              <p className='text-gray-700 font-medium text-xs sm:text-base'>Special Offers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy
