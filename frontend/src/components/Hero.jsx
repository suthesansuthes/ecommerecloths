import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative overflow-hidden rounded-3xl mt-6 mb-16'>
      {/* Background Gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950'></div>
      
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse'></div>
        <div className='absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/10 rounded-full mix-blend-screen filter blur-3xl'></div>
      </div>

      <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24 px-6 md:px-12 lg:px-16'>
        
        {/* Left Content */}
        <div className='space-y-8 z-10'>
          {/* Badge */}
          <div className='inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit hover:bg-white/15 transition-all'>
            <span className='text-yellow-400 text-sm'>✨ NEW COLLECTION 2024</span>
          </div>
          
          {/* Main Heading */}
          <div>
            <h1 className='text-white mb-4 leading-tight'>
              Elevate Your <span className='bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent'>Style Game</span>
            </h1>
            <p className='text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed font-light'>
              Discover an exclusive collection of premium clothing crafted for the modern fashion enthusiast. Quality meets elegance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Link to='/collection' className='btn-primary inline-block text-center'>
              👗 Explore Collection
            </Link>
            <button className='group px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2'>
              🎬 Watch Lookbook
              <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M8.5 5v14l11-7z'/>
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className='flex gap-8 pt-8 border-t border-white/20'>
            <div>
              <p className='text-3xl font-bold text-yellow-400'>500+</p>
              <p className='text-gray-400 text-sm'>Products</p>
            </div>
            <div>
              <p className='text-3xl font-bold text-yellow-400'>50K+</p>
              <p className='text-gray-400 text-sm'>Happy Customers</p>
            </div>
            <div>
              <p className='text-3xl font-bold text-yellow-400'>24/7</p>
              <p className='text-gray-400 text-sm'>Support</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className='relative hidden lg:block group'>
          <div className='absolute -inset-4 bg-gradient-to-br from-yellow-500/30 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-75 group-hover:opacity-100'></div>
          <img 
            src={assets.hero_img} 
            alt="Latest Fashion Collection" 
            className='relative w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent'></div>
          
          {/* Floating Badge */}
          <div className='absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl'>
            <p className='text-sm font-bold text-gray-900'>🔥 Trending</p>
          </div>
        </div>
      </div>

      {/* Mobile Image */}
      <div className='lg:hidden px-6 pb-8'>
        <div className='relative group'>
          <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-blue-500/30 rounded-3xl blur-2xl'></div>
          <img 
            src={assets.hero_img} 
            alt="Latest Fashion Collection"
            className='relative w-full rounded-3xl shadow-xl'
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
