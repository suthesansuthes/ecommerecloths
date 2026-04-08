import React, { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

  return (
    <div className='sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'>
      <div className='flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8'>
        
        {/* Logo */}
        <Link to='/'><img src={assets.logo} className='w-24 sm:w-32 hover:opacity-80 transition-opacity' alt="Forever Logo" /></Link>

        {/* Desktop Navigation */}
        <ul className='hidden sm:flex gap-8'>
          <NavLink to='/' className='group flex flex-col items-center gap-0.5'>
            <p className='text-sm font-medium text-gray-700 group-hover:text-black transition-colors'>HOME</p>
            <hr className='w-0 group-[.active]:w-full transition-all duration-300 border-none h-0.5 bg-black' />
          </NavLink>
          <NavLink to='/collection' className='group flex flex-col items-center gap-0.5'>
            <p className='text-sm font-medium text-gray-700 group-hover:text-black transition-colors'>COLLECTION</p>
            <hr className='w-0 group-[.active]:w-full transition-all duration-300 border-none h-0.5 bg-black' />
          </NavLink>
          <NavLink to='/about' className='group flex flex-col items-center gap-0.5'>
            <p className='text-sm font-medium text-gray-700 group-hover:text-black transition-colors'>ABOUT</p>
            <hr className='w-0 group-[.active]:w-full transition-all duration-300 border-none h-0.5 bg-black' />
          </NavLink>
          <NavLink to='/contact' className='group flex flex-col items-center gap-0.5'>
            <p className='text-sm font-medium text-gray-700 group-hover:text-black transition-colors'>CONTACT</p>
            <hr className='w-0 group-[.active]:w-full transition-all duration-300 border-none h-0.5 bg-black' />
          </NavLink>
        </ul>

        {/* Right Icons */}
        <div className='flex items-center gap-5'>
          {/* Search */}
          <button
            onClick={()=> { setShowSearch(true); navigate('/collection') }}
            className='text-gray-700 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg'
            aria-label='Search'
          >
            <img src={assets.search_icon} className='w-5' alt="Search" />
          </button>
          
          {/* Profile Dropdown - Desktop only */}
          <div className='group relative hidden sm:block'>
            <button
              onClick={()=> token ? null : navigate('/login')}
              className='text-gray-700 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg'
              aria-label='Profile'
            >
              <img className='w-5' src={assets.profile_icon} alt="Profile" />
            </button>
            {/* Dropdown Menu */}
            {token && 
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <div className='bg-white border border-gray-200 rounded-xl shadow-lg py-2 px-0 w-44 text-gray-700'>
                <p onClick={()=>navigate('/profile')} className='px-5 py-2.5 cursor-pointer hover:bg-gray-50 hover:text-black transition-colors font-medium'>My Profile</p>
                <p onClick={()=>navigate('/orders')} className='px-5 py-2.5 cursor-pointer hover:bg-gray-50 hover:text-black transition-colors'>Orders</p>
                <hr className='my-2 border-gray-200' />
                <p onClick={logout} className='px-5 py-2.5 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors font-medium'>Logout</p>
              </div>
            </div>}
          </div> 

          {/* Cart */}
          <Link to='/cart' className='relative group'>
            <div className='p-2 group-hover:bg-gray-100 rounded-lg transition-colors'>
              <img src={assets.cart_icon} className='w-5' alt="Cart" />
              {getCartCount() > 0 && (
                <p className='absolute right-0 top-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                  {getCartCount()}
                </p>
              )}
            </div>
          </Link> 

          {/* Mobile Menu Button */}
          <button
            onClick={()=>setVisible(true)}
            className='sm:hidden text-gray-700 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg'
            aria-label='Menu'
          >
            <img src={assets.menu_icon} className='w-5' alt="Menu" />
          </button>
        </div>

      </div>

      {/* Mobile Sidebar - rendered via Portal to escape backdrop-filter containing block */}
      {createPortal(
        <>
          {/* Mobile Sidebar Overlay */}
          {visible && <div onClick={()=>setVisible(false)} className='fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm sm:hidden' />}

          {/* Mobile Sidebar */}
          <div className={`fixed top-0 right-0 bottom-0 z-[70] w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out sm:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex flex-col h-full'>
              {/* Sidebar Header */}
              <div className='flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-900 to-black'>
                <img src={assets.logo} className='w-20 brightness-0 invert' alt="Logo" />
                <button onClick={()=>setVisible(false)} className='p-2 text-white hover:bg-white/10 rounded-full transition-colors' aria-label='Close menu'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* User Section */}
              <div className='px-5 py-4 bg-gray-50 border-b border-gray-200'>
                {token ? (
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm'>
                      👤
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-gray-900'>Welcome back!</p>
                      <p className='text-xs text-gray-500'>Manage your account</p>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>{setVisible(false); navigate('/login')}} className='w-full py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors'>
                    Sign In / Register
                  </button>
                )}
              </div>
              
              {/* Navigation Links */}
              <div className='flex flex-col overflow-y-auto flex-1 py-2'>
                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/'>
                  <span className='text-lg'>🏠</span>
                  <span className='font-medium text-gray-800 text-[15px]'>Home</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/collection'>
                  <span className='text-lg'>👗</span>
                  <span className='font-medium text-gray-800 text-[15px]'>Collection</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/about'>
                  <span className='text-lg'>ℹ️</span>
                  <span className='font-medium text-gray-800 text-[15px]'>About Us</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/contact'>
                  <span className='text-lg'>📞</span>
                  <span className='font-medium text-gray-800 text-[15px]'>Contact</span>
                </NavLink>

                <div className='my-2 mx-5 border-t border-gray-200'></div>

                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/cart'>
                  <span className='text-lg'>🛒</span>
                  <span className='font-medium text-gray-800 text-[15px]'>Cart</span>
                  {getCartCount() > 0 && (
                    <span className='ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>{getCartCount()}</span>
                  )}
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/orders'>
                  <span className='text-lg'>📋</span>
                  <span className='font-medium text-gray-800 text-[15px]'>My Orders</span>
                </NavLink>
                {token && (
                  <NavLink onClick={()=>setVisible(false)} className='flex items-center gap-4 py-3.5 px-5 hover:bg-blue-50 active:bg-blue-100 transition-colors' to='/profile'>
                    <span className='text-lg'>👤</span>
                    <span className='font-medium text-gray-800 text-[15px]'>My Profile</span>
                  </NavLink>
                )}
              </div>

              {/* Sidebar Footer */}
              {token && (
                <div className='px-5 py-4 border-t border-gray-200'>
                  <button onClick={()=>{logout(); setVisible(false)}} className='w-full py-2.5 border-2 border-red-500 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors'>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

export default Navbar
