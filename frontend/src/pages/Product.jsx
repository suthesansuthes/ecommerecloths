import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewsSection from '../components/ReviewsSection';
import { toast } from 'react-toastify'

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Get stock for selected size
  const getStockForSize = () => {
    if (!productData || !productData.stock) return 0
    
    if (typeof productData.stock === 'object' && size) {
      return Number(productData.stock[size]) || 0
    } else if (typeof productData.stock === 'number') {
      return productData.stock
    }
    return 0
  }

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
    setSize('')
    setQuantity(1)
  }, [productId, products])

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size')
      return
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size)
    }
    toast.success('✅ Added to cart!')
    setQuantity(1)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? '❤️ Removed from wishlist' : '❤️ Added to wishlist')
  }

  return productData ? (
    <div className='pt-6'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-2 text-sm text-gray-600 mb-8'>
        <span className='hover:text-gray-900 cursor-pointer'>Home</span>
        <span>/</span>
        <span className='hover:text-gray-900 cursor-pointer'>{productData.category}</span>
        <span>/</span>
        <span className='text-gray-900 font-semibold'>{productData.name.slice(0, 30)}</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
        
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className='relative bg-gray-100 rounded-lg overflow-hidden mb-4 group'>
            <img src={image} alt={productData.name} className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300' />
            {productData.bestseller && (
              <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                🏆 Bestseller
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          <div className='flex gap-3 overflow-x-auto'>
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`thumbnail ${index}`}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                  image === item ? 'border-2 border-blue-600' : 'border-2 border-gray-200 hover:border-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Title */}
          <h1 className='text-gray-900 mb-3'>{productData.name}</h1>

          {/* Rating */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='flex gap-1'>
              {[...Array(4)].map((_, i) => (
                <svg key={i} className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z' />
                </svg>
              ))}
              <svg className='w-5 h-5 text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z' />
              </svg>
            </div>
            <span className='text-sm text-gray-600'>(142 reviews)</span>
          </div>

          {/* Price */}
          <div className='mb-6 pb-6 border-b'>
            <p className='text-4xl font-bold text-blue-600 mb-2'>{currency}{formatPrice(productData.price)}</p>
            {getStockForSize() > 0 ? (
              <p className='text-lg text-green-600 font-semibold'>✓ In Stock ({getStockForSize()} available for size {size || 'select size'})</p>
            ) : (
              <p className='text-lg text-red-600 font-semibold'>✗ Out of Stock{size ? ` for size ${size}` : ''}</p>
            )}
          </div>

          {/* Description */}
          <p className='text-gray-600 mb-6 leading-relaxed'>{productData.description}</p>

          {/* Size Selection */}
          <div className='mb-6'>
            <label className='block text-sm font-semibold text-gray-900 mb-3'>
              Select Size *
            </label>
            <div className='grid grid-cols-4 gap-2'>
              {productData.sizes.map((sizeOption, index) => (
                <button
                  key={index}
                  onClick={() => setSize(sizeOption)}
                  className={`py-3 rounded-lg font-semibold border-2 transition-all ${
                    size === sizeOption
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className='flex gap-4 mb-6'>
            <div className='flex items-center border border-gray-300 rounded-lg'>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className='px-4 py-3 text-gray-600 hover:bg-gray-100'>−</button>
              <span className='px-6 py-3 font-semibold'>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className='px-4 py-3 text-gray-600 hover:bg-gray-100'>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={getStockForSize() <= 0 || !size}
              className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
              {!size ? 'Select a Size' : getStockForSize() <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={toggleWishlist}
              className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                isWishlisted
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:border-red-400'
              }`}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Trust Badges */}
          <div className='bg-blue-50 rounded-lg p-4 space-y-2 text-sm text-gray-700'>
            <p className='flex items-center gap-2'>
              <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
              </svg>
              100% Original & Authentic Products
            </p>
            <p className='flex items-center gap-2'>
              <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
              </svg>
              Easy Return & Exchange (7 Days)
            </p>
            <p className='flex items-center gap-2'>
              <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
              </svg>
              Cash on Delivery Available
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='border-t-2 pt-8'>
        <div className='flex gap-6 mb-6 border-b'>
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            Reviews (142)
          </button>
        </div>

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className='space-y-4 text-gray-700'>
            <p>{productData.description}</p>
            <p>This premium quality fabric ensures comfort and durability. Perfect for everyday wear or special occasions. Our products are carefully crafted to meet the highest standards of quality and style.</p>
            <h3 className='font-bold text-gray-900 mt-6 mb-3'>Product Details:</h3>
            <ul className='list-disc list-inside space-y-2 text-gray-600'>
              <li>Material: Premium Cotton/Polyester blend</li>
              <li>Care: Machine wash cold, gentle cycle</li>
              <li>Fit: Regular fit, true to size</li>
              <li>Shipping: Free delivery on orders above {currency}500</li>
            </ul>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <ReviewsSection productId={productId} />
        )}
      </div>

      {/* Related Products */}
      <div className='mt-16'>
        <h2 className='text-2xl font-bold mb-8'>Related Products</h2>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

    </div>
  ) : <div className='flex justify-center items-center h-96'>
    <div className='animate-spin'>
      <svg className='w-12 h-12 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
      </svg>
    </div>
  </div>
}

export default Product
