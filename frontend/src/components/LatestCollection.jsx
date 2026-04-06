import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <div className='my-16 md:my-20'>
      <div className='text-center space-y-6 mb-16'>
        {/* Preheading */}
        <div className='flex items-center justify-center gap-2'>
          <div className='h-1 w-12 bg-gradient-to-r from-yellow-400 to-transparent rounded'></div>
          <p className='text-yellow-600 font-bold text-xs md:text-sm tracking-widest'>NEW ARRIVALS</p>
          <div className='h-1 w-12 bg-gradient-to-l from-yellow-400 to-transparent rounded'></div>
        </div>

        {/* Main Heading */}
        <div>
          <h2 className='text-3xl md:text-5xl font-bold text-black mb-2'>
            Latest <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600'>Collections</span>
          </h2>
        </div>

        {/* Description */}
        <p className='text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light'>
          Fresh finds just for you — discover our handpicked selection of premium pieces that define contemporary style.
        </p>
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} stock={item.stock} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection
