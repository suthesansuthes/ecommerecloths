import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <div className='py-16 md:py-20'>
      <div className='text-center space-y-6 mb-16'>
        {/* Preheading */}
        <div className='flex items-center justify-center gap-2'>
          <div className='h-1 w-12 bg-gradient-to-r from-yellow-400 to-transparent rounded'></div>
          <p className='text-yellow-600 font-bold text-xs md:text-sm tracking-widest'>CUSTOMER FAVORITES</p>
          <div className='h-1 w-12 bg-gradient-to-l from-yellow-400 to-transparent rounded'></div>
        </div>

        {/* Main Heading */}
        <div>
          <h2 className='text-3xl md:text-5xl font-bold text-black mb-2'>
            Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600'>Bestsellers</span>
          </h2>
        </div>

        {/* Description */}
        <p className='text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light'>
          Discover the most loved and trending pieces selected by our customers. Premium quality, stylish designs, and unbeatable value in every item.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
        {
            bestSeller.map((item, index)=>(
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} stock={item.stock} />
            ))
        }
      </div>

      {/* View All Button */}
      <div className='text-center mt-12'>
        <button className='btn-secondary px-8 py-3'>
          View All Bestsellers
        </button>
      </div>
    </div>
  )
}

export default BestSeller
