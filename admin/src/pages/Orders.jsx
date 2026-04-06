import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const statuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
  const statusColors = {
    'Order Placed': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '📋' },
    'Packing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📦' },
    'Shipped': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '✈️' },
    'Out for delivery': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🚚' },
    'Delivered': { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' }
  }

  const fetchAllOrders = async () => {

    if (!token) {
      return null
    }

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
        setFilteredOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Filter and search
  useEffect(() => {
    let filtered = [...orders]

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.phone.includes(searchQuery)
      )
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.amount - a.amount)
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.amount - b.amount)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter, sortBy])

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('✅ Order status updated')
        await fetchAllOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to update status')
    }
  }

  const getStatusProgress = (status) => {
    const statusIndex = statuses.indexOf(status)
    return ((statusIndex + 1) / statuses.length) * 100
  }

  const getStatusCount = (status) => {
    if (status === 'All') {
      return orders.length
    }
    return orders.filter(order => order.status === status).length
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='bg-white rounded-lg'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
          <div className='p-3 bg-blue-100 rounded-lg'>
            <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
            </svg>
          </div>
          Order Management
        </h1>
        <p className='text-gray-500 mt-2'>Track and manage all customer orders</p>
      </div>

      {/* Search & Filter Bar */}
      <div className='mb-6 space-y-4 bg-gray-50 p-4 rounded-lg'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <svg className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-4H7V4h8v14z' />
            </svg>
            <input
              type='text'
              placeholder='Search by Order ID, Name, or Phone...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='highest'>Highest Amount</option>
            <option value='lowest'>Lowest Amount</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-300'>
          {['All', ...statuses].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
              }`}
            >
              {status === 'All' 
                ? `📊 All (${getStatusCount('All')})` 
                : `${statusColors[status]?.icon} ${status} (${getStatusCount(status)})`
              }
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <svg className='w-12 h-12 animate-spin text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
          </svg>
        </div>
      ) : filteredOrders.length === 0 ? (
        // Empty State
        <div className='flex flex-col items-center justify-center py-12'>
          <svg className='w-16 h-16 text-gray-400 mb-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
          </svg>
          <p className='text-gray-600 font-semibold mb-2'>No orders found</p>
          <p className='text-gray-500 text-sm'>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className='bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer'
              onClick={() => setSelectedOrder(order)}
            >
              <div className='grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4'>
                
                {/* Order Info */}
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold mb-1'>Order ID</p>
                  <p className='text-lg font-bold text-gray-900 font-mono'>{order._id.slice(0, 8)}...</p>
                  <p className='text-xs text-gray-500 mt-3'>{new Date(order.date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                </div>

                {/* Customer & Items */}
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold mb-1'>Customer</p>
                  <p className='font-semibold text-gray-900'>{order.address.firstName} {order.address.lastName}</p>
                  <p className='text-xs text-gray-600 mt-1'>{order.address.phone}</p>
                  <p className='text-xs text-gray-500 mt-2 flex items-center gap-2'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'><path d='M12 5l9 8-4-5.5L7 16H5l2-8.5-4 5.5 9-8z'/></svg>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Amount & Status */}
                <div className='flex flex-col justify-between'>
                  <div>
                    <p className='text-xs text-gray-600 uppercase font-semibold mb-1'>Total Amount</p>
                    <p className='text-2xl font-bold text-blue-600'>{currency}{order.amount}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-4'>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}>
                      {statusColors[order.status]?.icon} {order.status}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${order.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.payment ? '✓ Paid' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              </div>
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
                <p className='text-blue-100 text-sm mt-1'>ID: {selectedOrder._id}</p>
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
                <div className='space-y-2'>
                  {statuses.map((status, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                        statuses.indexOf(selectedOrder.status) >= idx
                          ? statusColors[status]?.bg + ' ' + statusColors[status]?.text
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {statusColors[status]?.icon}
                      </div>
                      <div className='flex-1'>
                        <p className={`font-medium ${statuses.indexOf(selectedOrder.status) >= idx ? 'text-gray-900' : 'text-gray-400'}`}>
                          {status}
                        </p>
                      </div>
                      {selectedOrder.status === status && (
                        <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>Current</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status Selector */}
                <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <label className='text-sm font-semibold text-gray-700 block mb-2'>Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => statusHandler({target: {value: e.target.value}}, selectedOrder._id)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-bold text-gray-900 mb-3'>Customer Information</h3>
                  <div className='space-y-2 text-sm'>
                    <p><span className='text-gray-600'>Name:</span> <span className='font-semibold'>{selectedOrder.address.firstName} {selectedOrder.address.lastName}</span></p>
                    <p><span className='text-gray-600'>Phone:</span> <span className='font-semibold'>{selectedOrder.address.phone}</span></p>
                    <p><span className='text-gray-600'>Email:</span> <span className='font-semibold'>{selectedOrder.address.email || '—'}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className='font-bold text-gray-900 mb-3'>Delivery Address</h3>
                  <div className='text-sm text-gray-700 space-y-1'>
                    <p>{selectedOrder.address.street}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipcode}</p>
                    <p>{selectedOrder.address.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className='font-bold text-gray-900 mb-3'>Order Items ({selectedOrder.items.length})</h3>
                <div className='space-y-2'>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={`${item.id || item._id || idx}-${item.size}`} className='flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200'>
                      {item.image && (
                        <img src={item.image[0]} alt={item.name} className='w-12 h-12 object-cover rounded' />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>{item.name}</p>
                        <p className='text-sm text-gray-600'>Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className='font-semibold text-gray-900'>{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6'>
                <div>
                  <p className='text-sm text-gray-600 mb-2'>Payment Method</p>
                  <p className='font-semibold text-gray-900'>{selectedOrder.paymentMethod || '—'}</p>
                  <p className={`text-sm mt-2 px-3 py-1 rounded-full inline-block ${selectedOrder.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {selectedOrder.payment ? '✓ Payment Completed' : '⏳ Payment Pending'}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-600 mb-2'>Total Amount</p>
                  <p className='text-3xl font-bold text-blue-600'>{currency}{selectedOrder.amount}</p>
                </div>
              </div>

              {/* Date Info */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800'>
                <p>Order placed on <strong>{new Date(selectedOrder.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</strong></p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders