import React, { useContext, useState } from 'react'
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
        <Link to='/'><img src={assets.logo} className='w-32 hover:opacity-80 transition-opacity' alt="Forever Logo" /></Link>

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
          
          {/* Profile Dropdown */}
          <div className='group relative'>
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
                <p className='px-5 py-2.5 cursor-pointer hover:bg-gray-50 hover:text-black transition-colors font-medium'>My Profile</p>
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

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 right-0 bottom-0 z-40 bg-white transition-all duration-300 ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col h-full'>
            <div onClick={()=>setVisible(false)} className='flex items-center justify-between p-5 border-b border-gray-200 cursor-pointer'>
              <img className='h-4 rotate-180 opacity-70' src={assets.dropdown_icon} alt="Close" />
            </div>
            
            <div className='flex flex-col overflow-y-auto flex-1'>
              <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors' to='/'>HOME</NavLink>
              <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors' to='/collection'>COLLECTION</NavLink>
              <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors' to='/about'>ABOUT</NavLink>
              <NavLink onClick={()=>setVisible(false)} className='py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors' to='/contact'>CONTACT</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
