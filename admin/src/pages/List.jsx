import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedItems, setSelectedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['All', 'Men', 'Women', 'Kids']

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
        setFilteredList(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  // Filter and search
  useEffect(() => {
    let filtered = [...list]

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'nameAZ') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredList(filtered)
    setCurrentPage(1)
  }, [list, searchQuery, categoryFilter, sortBy])

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('✅ Product deleted successfully')
        setDeleteConfirm(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const deleteBulk = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Select items to delete')
      return
    }

    try {
      for (const id of selectedItems) {
        await axios.post(
          backendUrl + '/api/product/remove',
          { id },
          { headers: { token } }
        )
      }
      toast.success(`✅ ${selectedItems.length} product(s) deleted`)
      setSelectedItems([])
      await fetchList()
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete some products')
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedList.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedList.map(item => item._id))
    }
  }

  const toggleItemSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const paginatedList = filteredList.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredList.length / itemsPerPage)

  useEffect(() => {
    fetchList()
  }, [])

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
          Product Inventory
        </h1>
        <p className='text-gray-500 mt-2'>Manage all your products with ease</p>
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
              placeholder='Search products...'
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
            <option value='priceLow'>Price: Low to High</option>
            <option value='priceHigh'>Price: High to Low</option>
            <option value='nameAZ'>Name: A to Z</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' />
            </svg>
            Filters
          </button>
        </div>

        {/* Category Filter (Expandable) */}
        {showFilters && (
          <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-300'>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between'>
          <p className='text-blue-800 font-semibold'>
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={deleteBulk}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z' />
            </svg>
            Delete Selected
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <svg className='w-12 h-12 animate-spin text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
          </svg>
        </div>
      ) : filteredList.length === 0 ? (
        // Empty State
        <div className='flex flex-col items-center justify-center py-12'>
          <svg className='w-16 h-16 text-gray-400 mb-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
          </svg>
          <p className='text-gray-600 font-semibold mb-2'>No products found</p>
          <p className='text-gray-500 text-sm'>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          {/* Table - Desktop */}
          <div className='hidden md:block overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-100 border border-gray-200'>
                  <th className='px-4 py-3 text-left'>
                    <input
                      type='checkbox'
                      checked={selectedItems.length === paginatedList.length && paginatedList.length > 0}
                      onChange={toggleSelectAll}
                      className='w-4 h-4 cursor-pointer'
                    />
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Image</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Name</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Category</th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Price</th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item, index) => (
                  <tr key={item._id} className='border border-gray-200 hover:bg-gray-50 transition-colors group'>
                    <td className='px-4 py-3'>
                      <input
                        type='checkbox'
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleItemSelect(item._id)}
                        className='w-4 h-4 cursor-pointer'
                      />
                    </td>
                    <td className='px-4 py-3'>
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className='w-12 h-12 object-cover rounded-lg'
                      />
                    </td>
                    <td className='px-4 py-3 text-sm font-medium text-gray-900'>{item.name}</td>
                    <td className='px-4 py-3'>
                      <span className='px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full'>
                        {item.category}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm font-semibold text-gray-900'>
                      {currency}{item.price}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <div className='flex justify-center gap-2'>
                        <button
                          onClick={() => navigate(`/edit/${item._id}`)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                          title='Edit'
                        >
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z' />
                            <path d='M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                          title='Delete'
                        >
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z' />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards - Mobile */}
          <div className='md:hidden space-y-4'>
            {paginatedList.map((item, index) => (
              <div key={item._id} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                <div className='flex gap-4'>
                  <input
                    type='checkbox'
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleItemSelect(item._id)}
                    className='w-4 h-4 cursor-pointer mt-1'
                  />
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className='w-16 h-16 object-cover rounded-lg'
                  />
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900'>{item.name}</h3>
                    <p className='text-sm text-gray-600 mt-1'>{item.category}</p>
                    <p className='text-lg font-bold text-blue-600 mt-2'>{currency}{item.price}</p>
                  </div>
                </div>
                <div className='flex gap-2 mt-3'>
                  <button
                    onClick={() => navigate(`/edit/${item._id}`)}
                    className='flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item._id)}
                    className='flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 max-w-sm shadow-xl'>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>Delete Product?</h2>
                <p className='text-gray-600 mb-6'>
                  This action cannot be undone. The product will be permanently deleted.
                </p>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => removeProduct(deleteConfirm)}
                    className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-6 flex justify-between items-center'>
              <p className='text-sm text-gray-600'>
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length} products
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  ← Previous
                </button>
                <div className='flex items-center gap-2'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default List