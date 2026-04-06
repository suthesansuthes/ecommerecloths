import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const navItems = [
    {
      path: '/add',
      icon: '➕',
      label: 'Add Product'
    },
    {
      path: '/list',
      icon: '📋',
      label: 'All Products'
    },
    {
      path: '/orders',
      icon: '📦',
      label: 'Orders'
    },
    {
      path: '/filter-options',
      icon: '🔍',
      label: 'Filter Options'
    },
    {
      path: '/newsletter',
      icon: '📧',
      label: 'Newsletter'
    }
  ]

  return (
    <div className='pt-4 pb-8'>
      <nav className='space-y-2 px-4'>
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              sidebar-link
              ${isActive ? 'active' : ''}
            `}
          >
            <span className='text-xl'>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Additional Info */}
      <div className='mt-8 px-6 py-4 bg-blue-50 rounded-lg border border-blue-200 mx-4'>
        <p className='text-sm font-medium text-gray-900 mb-1'>💡 Tip</p>
        <p className='text-xs text-gray-600'>Manage your products and orders efficiently</p>
      </div>
    </div>
  )
}

export default Sidebar