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
    <div className='bg-white border-b border-gray-100 py-1.5 sm:py-3'>
      <div className='max-w-2xl mx-auto px-3 sm:px-4'>
        <div className='flex items-center gap-1.5'>
          {/* Search Input */}
          <div className='flex-1 flex items-center gap-1.5 sm:gap-3 bg-gray-50 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all'>
            <img className='w-3.5 sm:w-4 flex-shrink-0 opacity-50' src={assets.search_icon} alt="Search" />
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='flex-1 min-w-0 outline-none bg-transparent text-gray-900 placeholder-gray-400 text-xs sm:text-sm'
              type="text"
              placeholder='Search...'
              autoFocus
            />
            {search && (
              <button
                onClick={()=>setSearch('')}
                className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0'
              >
                <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={()=>setShowSearch(false)}
            className='flex-shrink-0 text-gray-500 hover:text-gray-800 transition-colors px-1.5 py-1 text-xs font-medium'
            aria-label='Close search'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default SearchBar
