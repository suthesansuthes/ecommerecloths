import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken, sidebarOpen, setSidebarOpen}) => {
  return (
    <div className='navbar'>
      <div className='navbar-content'>
        {/* Left: Menu Button + Logo */}
        <div className='flex items-center gap-3'>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            title='Toggle Sidebar'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
          <img className='w-28 h-8 object-contain' src={assets.logo} alt="Admin Logo" />
        </div>

        {/* Right: Admin Info + Logout */}
        <div className='flex items-center gap-6'>
          {/* Admin Badge */}
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-blue-600 font-semibold'>A</span>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>Admin</p>
              <p className='text-xs text-gray-500'>Dashboard</p>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={()=>setToken('')}
            className='btn btn-danger btn-sm'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar