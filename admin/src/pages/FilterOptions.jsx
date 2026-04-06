import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const FilterOptions = ({ token }) => {
  const [filterOptions, setFilterOptions] = useState([])
  const [selectedType, setSelectedType] = useState('brand')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    icon: '',
    colorCode: '',
    description: ''
  })

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${backendUrl}/api/filter/all?type=${selectedType}&active=true`
      )
      if (response.data.success) {
        setFilterOptions(response.data.data)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load filter options')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [selectedType])

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add or update filter option
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setLoading(true)

      if (editingId) {
        // Update
        const response = await axios.put(
          `${backendUrl}/api/filter/update/${editingId}`,
          {
            displayName: formData.displayName || formData.name,
            icon: formData.icon,
            colorCode: formData.colorCode,
            description: formData.description
          }
        )

        if (response.data.success) {
          toast.success('Filter option updated successfully')
          setEditingId(null)
          setFormData({ name: '', displayName: '', icon: '', colorCode: '', description: '' })
          setShowForm(false)
          fetchFilterOptions()
        }
      } else {
        // Add new
        const response = await axios.post(
          `${backendUrl}/api/filter/add`,
          {
            type: selectedType,
            name: formData.name,
            displayName: formData.displayName || formData.name,
            icon: formData.icon,
            colorCode: formData.colorCode,
            description: formData.description
          }
        )

        if (response.data.success) {
          toast.success('Filter option added successfully')
          setFormData({ name: '', displayName: '', icon: '', colorCode: '', description: '' })
          setShowForm(false)
          fetchFilterOptions()
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to save filter option')
    } finally {
      setLoading(false)
    }
  }

  // Edit filter option
  const handleEdit = (option) => {
    setEditingId(option._id)
    setFormData({
      name: option.name,
      displayName: option.displayName,
      icon: option.icon,
      colorCode: option.colorCode,
      description: option.description
    })
    setShowForm(true)
  }

  // Delete filter option
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this filter option?')) return

    try {
      const response = await axios.delete(
        `${backendUrl}/api/filter/delete/${id}`
      )

      if (response.data.success) {
        toast.success('Filter option deleted successfully')
        fetchFilterOptions()
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete filter option')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', displayName: '', icon: '', colorCode: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const filterTypeConfig = {
    brand: { label: '🏢 Brands', icon: '🏢' },
    color: { label: '🎨 Colors', icon: '🎨' },
    material: { label: '🧵 Materials', icon: '🧵' }
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Filter Options Management</h1>
        <p className='text-gray-600'>Manage brands, colors, and materials for product filters</p>
      </div>

      {/* Filter Type Tabs */}
      <div className='flex gap-4 mb-8 border-b border-gray-200'>
        {Object.entries(filterTypeConfig).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              selectedType === type
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className='mb-6'>
        <button
          onClick={() => setShowForm(true)}
          className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105'
        >
          ➕ Add {filterTypeConfig[selectedType].label}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className='mb-8 bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg'>
          <h2 className='text-xl font-bold text-gray-900 mb-6'>
            {editingId ? '✏️ Edit' : '➕ Add'} {filterTypeConfig[selectedType].label}
          </h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Name (Read-only for edit) */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Name *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={editingId !== null}
                  placeholder='e.g., Nike, Red, Cotton'
                  className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
                />
              </div>

              {/* Display Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Display Name (Optional)
                </label>
                <input
                  type='text'
                  name='displayName'
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder='How it appears to users (defaults to name)'
                  className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                />
              </div>

              {/* Icon */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Icon (Optional)
                </label>
                <input
                  type='text'
                  name='icon'
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder='e.g., 👟 or image URL'
                  className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                />
                {formData.icon && (
                  <p className='mt-2 text-2xl'>{formData.icon}</p>
                )}
              </div>

              {/* Color Code (for colors) */}
              {selectedType === 'color' && (
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Color Code (Optional)
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      name='colorCode'
                      value={formData.colorCode}
                      onChange={handleInputChange}
                      placeholder='#FF0000'
                      className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                    <input
                      type='color'
                      value={formData.colorCode || '#000000'}
                      onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                      className='w-14 h-10 rounded-lg cursor-pointer'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Description (Optional)
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Add any additional details'
                rows='3'
                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none'
              />
            </div>

            {/* Buttons */}
            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={resetForm}
                className='flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all'
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Option
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Options List */}
      <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
        {loading && filterOptions.length === 0 ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin'>
              <svg className='w-12 h-12 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
              </svg>
            </div>
          </div>
        ) : filterOptions.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-100 border-b-2 border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Icon</th>
                  <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Name</th>
                  <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Display Name</th>
                  {selectedType === 'color' && (
                    <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Color</th>
                  )}
                  <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Description</th>
                  <th className='px-6 py-4 text-left text-sm font-bold text-gray-900'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterOptions.map((option, index) => (
                  <tr key={option._id} className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <span className='text-2xl'>{option.icon || '—'}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='font-semibold text-gray-900'>{option.name}</span>
                    </td>
                    <td className='px-6 py-4 text-gray-700'>
                      {option.displayName}
                    </td>
                    {selectedType === 'color' && (
                      <td className='px-6 py-4'>
                        {option.colorCode ? (
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-8 h-8 rounded-lg border-2 border-gray-300'
                              style={{ backgroundColor: option.colorCode }}
                            ></div>
                            <span className='text-sm text-gray-600'>{option.colorCode}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                    <td className='px-6 py-4 text-gray-600 text-sm'>
                      {option.description ? option.description.slice(0, 40) + '...' : '—'}
                    </td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        onClick={() => handleEdit(option)}
                        className='px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors'
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(option._id)}
                        className='px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors'
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-600 text-lg mb-4'>
              No {filterTypeConfig[selectedType].label} added yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
            >
              ➕ Add First {filterTypeConfig[selectedType].label}
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className='mt-8 grid grid-cols-3 gap-4'>
        {Object.entries(filterTypeConfig).map(([type, config]) => (
          <div
            key={type}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedType === type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className='text-3xl mb-2'>{config.icon}</div>
            <div className='text-sm text-gray-600 mb-1'>{config.label}</div>
            <div className='text-2xl font-bold text-gray-900'>
              {filterOptions.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterOptions
