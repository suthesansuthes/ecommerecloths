import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify'

const Cart = () => {

  const { products, currency, formatPrice, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const DELIVERY_FEE = 50
  const FREE_SHIPPING_THRESHOLD = 500

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  // Calculate subtotal
  const getSubtotal = () => {
    return cartData.reduce((total, item) => {
      const productData = products.find((product) => product._id === item._id);
      return total + (productData ? productData.price * item.quantity : 0);
    }, 0);
  }

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE
  const discountAmount = Math.floor(subtotal * discount / 100)
  const total = subtotal + deliveryFee - discountAmount

  const applyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setDiscount(10)
      toast.success('✅ Discount code applied! (10% off)')
    } else if (discountCode === 'SAVE20') {
      setDiscount(20)
      toast.success('✅ Discount code applied! (20% off)')
    } else {
      toast.error('❌ Invalid discount code')
      setDiscount(0)
    }
  }

  return (
    <div className='pt-8 pb-16'>
      {/* Header */}
      <div className='mb-8'>
        <Title text1={'YOUR'} text2={'CART'} />
        <p className='text-gray-600 mt-2'>{cartData.length} item{cartData.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      {cartData.length === 0 ? (
        // Empty Cart
        <div className='flex flex-col items-center justify-center py-16'>
          <svg className='w-24 h-24 text-gray-400 mb-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-. 9-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.25 13h10.5c.55 0 1.04-.32 1.3-.82l3.57-6.49A1 1 0 0020 5H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z' />
          </svg>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Your cart is empty</h2>
          <p className='text-gray-600 mb-6'>Add some items to get started</p>
          <button
            onClick={() => navigate('/collection')}
            className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              return productData ? (
                <div key={index} className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow group'>
                  {/* Mobile: Horizontal card layout */}
                  <div className='flex gap-3 sm:gap-4'>
                    {/* Product Image */}
                    <div className='flex-shrink-0'>
                      <img
                        src={productData.image[0]}
                        alt={productData.name}
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg'
                      />
                    </div>

                    {/* Product Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-gray-900 text-sm sm:text-lg truncate'>{productData.name}</h3>
                      <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>Size: <span className='font-semibold text-gray-700'>{item.size}</span></p>
                      <p className='text-sm sm:text-lg font-bold text-gray-900 mt-1'>{currency}{formatPrice(productData.price)}</p>
                    </div>

                    {/* Remove Button - Always visible on mobile */}
                    <button
                      onClick={() => setShowDeleteConfirm(index)}
                      className='self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0'
                    >
                      <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity & Subtotal Row */}
                  <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                    {/* Quantity Selector */}
                    <div className='flex items-center border border-gray-300 rounded-lg'>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-sm'
                      >
                        −
                      </button>
                      <span className='px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-sm'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-sm'
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className='text-right'>
                      <p className='text-xs text-gray-500'>Subtotal</p>
                      <p className='text-base sm:text-lg font-bold text-gray-900'>{currency}{formatPrice(productData.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Summary Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-4 space-y-6'>
              {/* Order Summary Card */}
              <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Order Summary</h2>

                {/* Discount Section */}
                <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Discount Code
                  </label>
                  <div className='flex gap-2 mb-2'>
                    <input
                      type='text'
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder='SAVE10'
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                    <button
                      onClick={applyDiscount}
                      className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
                    >
                      Apply
                    </button>
                  </div>
                  <p className='text-xs text-blue-700'>Try: SAVE10 or SAVE20</p>
                </div>

                {/* Pricing Details */}
                <div className='space-y-3 border-t border-gray-300 pt-4 mb-4'>
                  <div className='flex justify-between text-gray-700'>
                    <span>Subtotal</span>
                    <span className='font-semibold'>{currency}{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className='flex justify-between text-green-600 font-semibold'>
                      <span>Discount ({discount}%)</span>
                      <span>-{currency}{discountAmount}</span>
                    </div>
                  )}
                  <div className='flex justify-between text-gray-700'>
                    <span>Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className='text-green-600 font-semibold'>FREE ✓</span>
                    ) : (
                      <span className='font-semibold'>{currency}{deliveryFee}</span>
                    )}
                  </div>
                  {deliveryFee > 0 && (
                    <p className='text-xs text-gray-500'>Add {currency}{FREE_SHIPPING_THRESHOLD - subtotal} more for free shipping!</p>
                  )}
                </div>

                {/* Total */}
                <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-4 mb-6'>
                  <span>Total</span>
                  <span className='text-blue-600'>{currency}{total}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/place-order')}
                  className='w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105'
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/collection')}
                  className='w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                  </svg>
                  Secure Checkout
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                  </svg>
                  7-Day Free Return
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                  </svg>
                  All Payment Methods
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm shadow-xl'>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>Remove item?</h2>
            <p className='text-gray-600 mb-6'>Are you sure you want to remove this item from your cart?</p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const item = cartData[showDeleteConfirm]
                  updateQuantity(item._id, item.size, 0)
                  setShowDeleteConfirm(null)
                  toast.success('Item removed from cart')
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
