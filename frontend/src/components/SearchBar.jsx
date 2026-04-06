import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])
    
  return showSearch && visible ? (
    <div className='bg-white border-b border-gray-200 py-6 sticky top-20 z-40'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='relative'>
          <div className='flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3 border border-gray-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 transition-all duration-300'>
            <img className='w-5 text-gray-400' src={assets.search_icon} alt="Search" />
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base'
              type="text"
              placeholder='Search for products, brands, styles...'
            />
            {search && (
              <button
                onClick={()=>setSearch('')}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className='absolute right-4 top-6'>
          <button
            onClick={()=>setShowSearch(false)}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2'
            aria-label='Close search'
          >
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default SearchBar
