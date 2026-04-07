import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id, image, name, price, stock = 0}) => {
    
    const {currency, formatPrice} = useContext(ShopContext);

    // Calculate total stock from size-specific quantities or use single number
    const getTotalStock = () => {
      if (typeof stock === 'object' && stock !== null) {
        return Object.values(stock).reduce((sum, qty) => sum + Number(qty || 0), 0)
      }
      return Number(stock) || 0
    }

    const totalStock = getTotalStock()

  return (
    <Link onClick={()=>scrollTo(0,0)} to={`/product/${id}`} className='group block'>
      <div className='h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex flex-col'>
        
        {/* Product Image Container */}
        <div className='relative overflow-hidden bg-gray-50 aspect-[3/4]'>
          <img 
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
            src={image[0]} 
            alt={name} 
          />
          
          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          
          {/* Stock Badge */}
          <div className='absolute top-2 right-2 sm:top-3 sm:right-3'>
            {totalStock > 0 ? (
              <div className='bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm'>
                ✓ In Stock
              </div>
            ) : (
              <div className='bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm'>
                ✗ Sold Out
              </div>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className='p-3 sm:p-4 flex flex-col flex-1 bg-white'>
          
          {/* Product Name */}
          <h3 className='font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 leading-tight group-hover:text-black' style={{fontFamily: 'Outfit, sans-serif', letterSpacing: '0'}}>
            {name}
          </h3>
          
          {/* Rating Stars */}
          <div className='flex items-center gap-1 mb-2 sm:mb-3'>
            <div className='flex gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className='text-xs sm:text-sm'>
                  {i < 4 ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className='text-[10px] sm:text-xs text-gray-400'>(48)</span>
          </div>

          {/* Price - Bottom */}
          <div className='mt-auto pt-2 sm:pt-3 border-t border-gray-100'>
            <p className='text-base sm:text-lg font-bold text-gray-900'>
              {currency}{formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
