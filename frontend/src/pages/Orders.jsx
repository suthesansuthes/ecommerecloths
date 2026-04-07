import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify'

const Orders = () => {

  const { backendUrl, token, currency, formatPrice } = useContext(ShopContext);

  const [orderData, setorderData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']

  const statusColors = {
    'Order Placed': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '📋' },
    'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⚙️' },
    'Shipped': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '📦' },
    'Out for Delivery': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🚚' },
    'Delivered': { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
    'Packing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📦' },
    'Out for delivery': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🚚' }
  }

  const loadOrderData = async () => {
    try {
      setLoading(true)
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers: {token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            item['amount'] = order.amount
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      console.log(error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  const getStatusProgress = (status) => {
    const idx = statusSteps.indexOf(status)
    if (idx >= 0) return ((idx + 1) / statusSteps.length) * 100
    return 0
  }

  return (
    <div className='py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
        <p className='text-gray-600 mt-2'>{orderData.length} order{orderData.length !== 1 ? 's' : ''} found</p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <svg className='w-12 h-12 animate-spin text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
          </svg>
        </div>
      ) : orderData.length === 0 ? (
        // Empty State
        <div className='flex flex-col items-center justify-center py-16'>
          <svg className='w-24 h-24 text-gray-400 mb-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
          </svg>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>No Orders Yet</h2>
          <p className='text-gray-600'>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orderData.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedOrder(item)}
              className='bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg active:bg-gray-50 transition-all cursor-pointer'
            >
              {/* Mobile: Compact horizontal layout */}
              <div className='flex gap-3 sm:gap-4 items-start'>
                {/* Product Image */}
                <img src={item.image[0]} alt={item.name} className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0' />

                {/* Product Info */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>{item.name}</h3>
                  <p className='text-xs text-gray-500 mt-0.5'>Size: {item.size} | Qty: {item.quantity}</p>
                  <p className='text-sm font-bold text-gray-900 mt-1'>{currency}{formatPrice(item.price)}</p>
                  
                  {/* Status & Payment - inline on mobile */}
                  <div className='flex items-center gap-2 mt-2 flex-wrap'>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${statusColors[item.status]?.bg} ${statusColors[item.status]?.text}`}>
                      {statusColors[item.status]?.icon} {item.status}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                      item.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.payment ? '✓ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <svg className='w-4 h-4 text-gray-400 flex-shrink-0 mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </div>
              
              {/* Date */}
              <p className='text-[10px] sm:text-xs text-gray-400 mt-2 pl-[76px] sm:pl-[96px]'>{new Date(item.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            
            {/* Modal Header */}
            <div className='sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold'>Order Details</h2>
                <p className='text-blue-100 text-sm mt-1'>Order ID: {selectedOrder.orderId?.slice(0, 8)}...</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className='text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors'
              >
                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-6'>
              
              {/* Status Timeline */}
              <div>
                <h3 className='font-bold text-gray-900 mb-4'>Order Status</h3>
                <div className='flex justify-between items-center mb-3'>
                  {statusSteps.map((step, idx) => (
                    <div key={idx} className='flex flex-col items-center flex-1'>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                        statusSteps.indexOf(selectedOrder.status) >= idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {statusSteps.indexOf(selectedOrder.status) > idx ? '✓' : idx + 1}
                      </div>
                      <p className='text-xs text-center text-gray-700 font-semibold'>{step}</p>
                    </div>
                  ))}
                </div>
                {/* Progress Bar */}
                <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                  <div
                    className='bg-blue-600 h-full transition-all'
                    style={{width: `${getStatusProgress(selectedOrder.status)}%`}}
                  ></div>
                </div>
              </div>

              {/* Product Details */}
              <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <h3 className='font-bold text-gray-900 mb-3'>Product Details</h3>
                <div className='flex gap-4'>
                  <img src={selectedOrder.image[0]} alt={selectedOrder.name} className='w-20 h-20 object-cover rounded' />
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900'>{selectedOrder.name}</p>
                    <p className='text-sm text-gray-600 mt-1'>Price: {currency}{formatPrice(selectedOrder.price)}</p>
                    <p className='text-sm text-gray-600'>Size: {selectedOrder.size}</p>
                    <p className='text-sm text-gray-600'>Quantity: {selectedOrder.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-blue-600'>{currency}{formatPrice(selectedOrder.price * selectedOrder.quantity)}</p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Order Date</p>
                  <p className='text-gray-900 font-semibold'>{new Date(selectedOrder.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Payment Method</p>
                  <p className='text-gray-900 font-semibold capitalize'>{selectedOrder.paymentMethod || 'COD'}</p>
                </div>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Payment Status</p>
                  <p className={`font-semibold ${selectedOrder.payment ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedOrder.payment ? '✓ Paid' : '⏳ Pending'}
                  </p>
                </div>
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600 font-semibold mb-1'>Total Amount</p>
                  <p className='text-lg font-bold text-blue-600'>{currency}{selectedOrder.amount}</p>
                </div>
              </div>

              {/* Tracking */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-blue-800 font-semibold mb-2'>📍 Tracking Information</p>
                <p className='text-sm text-blue-700'>Your order is currently <strong>{selectedOrder.status}</strong>. You will receive updates via email and SMS.</p>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className='flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold'
                >
                  Close Details
                </button>
                <button
                  onClick={() => {
                    toast.info('Redirecting to support...')
                    setSelectedOrder(null)
                  }}
                  className='flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold'
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
