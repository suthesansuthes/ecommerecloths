import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl mt-1 sm:mt-6 mb-6 sm:mb-16'>
      {/* Background Gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950'></div>
      
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse'></div>
      </div>

      {/* Mobile Layout: image background with overlay text */}
      <div className='sm:hidden relative'>
        {/* Background Image */}
        <div className='relative h-[55vh] max-h-[420px]'>
          <img 
            src={assets.hero_img} 
            alt="Latest Fashion Collection"
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20'></div>
        </div>
        
        {/* Overlay Content */}
        <div className='absolute inset-0 px-5 flex flex-col items-center justify-between py-5 text-center'>
          
          {/* Top Badge */}
          <div className='inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 self-start'>
            <span className='text-white text-[11px] font-medium'>🔥 TRENDING NOW</span>
          </div>

          {/* Middle Badge */}
          <div className='inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20'>
            <span className='text-yellow-400 text-[12px] font-medium'>✨ NEW COLLECTION ARRIVED</span>
          </div>

          {/* Bottom Content */}
          <div className='flex flex-col items-center'>
            <h1 className='text-white mb-2 leading-[1.1] text-[1.6rem]' style={{fontFamily: "'Playfair Display', serif"}}>
              Elevate Your <span className='text-yellow-400'>Style</span>
            </h1>
            <p className='text-gray-300 text-[13px] leading-relaxed mb-4 max-w-[280px]'>
              Premium clothing for the modern fashion enthusiast.
            </p>

            <Link to='/collection' className='w-full max-w-[240px] py-2.5 bg-white text-black text-sm font-semibold rounded-full text-center active:scale-95 transition-transform shadow-lg'>
              Explore Collection →
            </Link>

            {/* Compact Stats */}
            <div className='flex gap-6 mt-4 pt-3 border-t border-white/15 w-full justify-center'>
              <div>
                <p className='text-base font-bold text-yellow-400'>500+</p>
                <p className='text-gray-400 text-[10px]'>Products</p>
              </div>
              <div>
                <p className='text-base font-bold text-yellow-400'>50K+</p>
                <p className='text-gray-400 text-[10px]'>Customers</p>
              </div>
              <div>
                <p className='text-base font-bold text-yellow-400'>24/7</p>
                <p className='text-gray-400 text-[10px]'>Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet & Desktop Layout */}
      <div className='relative hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24 px-6 md:px-12 lg:px-16'>
        
        {/* Left Content */}
        <div className='space-y-8 z-10 text-center lg:text-left items-center lg:items-start flex flex-col'>
          {/* Badge */}
          <div className='inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit hover:bg-white/15 transition-all'>
            <span className='text-yellow-400 text-sm'>✨ NEW COLLECTION ARRIVED</span>
          </div>
          
          {/* Main Heading */}
          <div>
            <h1 className='text-white mb-4 leading-tight'>
              Elevate Your <span className='bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent'>Style Game</span>
            </h1>
            <p className='text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed font-light mx-auto lg:mx-0'>
              Discover an exclusive collection of premium clothing crafted for the modern fashion enthusiast.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 pt-4 items-center lg:items-start'>
            <Link to='/collection' className='btn-primary inline-block text-center'>
              👗 Explore Collection
            </Link>
            <button className='group px-6 py-3 border-2 border-white/70 text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2'>
              🎬 Watch Lookbook
              <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M8.5 5v14l11-7z'/>
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className='flex gap-8 pt-8 border-t border-white/20 justify-center lg:justify-start w-full'>
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

        {/* Right Image - Desktop Only */}
        <div className='relative hidden lg:block group'>
          <div className='absolute -inset-4 bg-gradient-to-br from-yellow-500/30 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-75 group-hover:opacity-100'></div>
          <img 
            src={assets.hero_img} 
            alt="Latest Fashion Collection" 
            className='relative w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent'></div>
          <div className='absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl'>
            <p className='text-sm font-bold text-gray-900'>🔥 Trending</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
