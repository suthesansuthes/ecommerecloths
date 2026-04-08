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
          {visible && <div onClick={()=>setVisible(false)} className='fixed inset-0 z-[60] bg-black/60 backdrop-blur-md sm:hidden' />}

          {/* Mobile Sidebar - Glassmorphism */}
          <div className={`fixed top-0 right-0 bottom-0 z-[70] w-[82%] max-w-sm transition-transform duration-300 ease-out sm:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex flex-col h-full bg-white/70 backdrop-blur-2xl border-l border-white/30 shadow-[−20px_0_60px_rgba(0,0,0,0.15)]'>
              
              {/* Sidebar Header - Glassmorphism */}
              <div className='relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-500/90'></div>
                <div className='absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
                <div className='absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-lg'></div>
                <div className='relative flex items-center justify-between px-5 py-5'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30'>
                      <img src={assets.logo} className='w-5 brightness-0 invert' alt="Logo" />
                    </div>
                    <div>
                      <p className='text-white font-bold text-sm tracking-wide'>Dreams Clothing</p>
                      <p className='text-white/60 text-[10px]'>Premium Fashion</p>
                    </div>
                  </div>
                  <button onClick={()=>setVisible(false)} className='w-8 h-8 flex items-center justify-center bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/25 transition-all active:scale-90' aria-label='Close menu'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              </div>

              {/* User Section - Glass Card */}
              <div className='mx-4 mt-4 mb-2'>
                {token ? (
                  <div className='flex items-center gap-3 p-3.5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm'>
                    <div className='w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-200'>
                      👤
                    </div>
                    <div className='flex-1'>
                      <p className='text-[13px] font-bold text-gray-900'>Welcome back!</p>
                      <p className='text-[11px] text-gray-500'>Manage your account</p>
                    </div>
                    <div className='w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-300'></div>
                  </div>
                ) : (
                  <button onClick={()=>{setVisible(false); navigate('/login')}} className='w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]'>
                    ✨ Sign In / Register
                  </button>
                )}
              </div>
              
              {/* Navigation Links */}
              <div className='flex flex-col overflow-y-auto flex-1 px-3 py-2'>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-base shadow-sm'>🏠</span>
                  <span className='font-semibold text-[14px]'>Home</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/collection'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-base shadow-sm'>👗</span>
                  <span className='font-semibold text-[14px]'>Collection</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/about'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-base shadow-sm'>ℹ️</span>
                  <span className='font-semibold text-[14px]'>About Us</span>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/contact'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-base shadow-sm'>📞</span>
                  <span className='font-semibold text-[14px]'>Contact</span>
                </NavLink>

                <div className='my-2 mx-2 border-t border-gray-200/60'></div>

                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/cart'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-base shadow-sm'>🛒</span>
                  <span className='font-semibold text-[14px]'>Cart</span>
                  {getCartCount() > 0 && (
                    <span className='ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm shadow-red-200'>{getCartCount()}</span>
                  )}
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/orders'>
                  <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center text-base shadow-sm'>📋</span>
                  <span className='font-semibold text-[14px]'>My Orders</span>
                </NavLink>
                {token && (
                  <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `flex items-center gap-3.5 py-3 px-4 rounded-xl mb-0.5 transition-all ${isActive ? 'bg-indigo-50/80 text-indigo-700 shadow-sm' : 'text-gray-700 hover:bg-white/60 active:bg-white/80'}`} to='/profile'>
                    <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-base shadow-sm'>👤</span>
                    <span className='font-semibold text-[14px]'>My Profile</span>
                  </NavLink>
                )}
              </div>

              {/* Sidebar Footer - Glass */}
              {token && (
                <div className='px-4 py-4 border-t border-gray-200/50'>
                  <button onClick={()=>{logout(); setVisible(false)}} className='w-full py-2.5 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-bold rounded-xl border border-red-200/60 hover:bg-red-100/80 transition-all active:scale-[0.98] flex items-center justify-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' /></svg>
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
