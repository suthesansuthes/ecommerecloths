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
      <div className='h-full bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex flex-col'>
        
        {/* Product Image Container */}
        <div className='relative overflow-hidden bg-gray-100 aspect-square'>
          <img 
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
            src={image[0]} 
            alt={name} 
          />
          
          {/* Overlay on Hover */}
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
          
          {/* Stock Badge */}
          <div className='absolute top-3 right-3'>
            {totalStock > 0 ? (
              <div className='bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold'>
                ✓ In Stock
              </div>
            ) : (
              <div className='bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold'>
                ✗ Out
              </div>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className='p-4 flex flex-col flex-1 bg-white'>
          
          {/* Product Name */}
          <h3 className='font-bold text-sm md:text-base text-gray-900 line-clamp-2 mb-2 group-hover:text-black'>
            {name}
          </h3>
          
          {/* Rating Stars */}
          <div className='flex items-center gap-2 mb-3'>
            <div className='flex gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < 4 ? '⭐' : '☆'}`}>
                  {i < 4 ? '★' : '★'}
                </span>
              ))}
            </div>
            <span className='text-xs text-gray-500'>(48)</span>
          </div>

          {/* Price - Bottom */}
          <div className='mt-auto pt-3 border-t-2 border-gray-200'>
            <p className='text-xl font-bold text-blue-600'>
              {currency}{formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
