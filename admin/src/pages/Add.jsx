import React, { useState, useEffect } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [images, setImages] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [sizeQuantities, setSizeQuantities] = useState({})
  const [brand, setBrand] = useState("")
  const [color, setColor] = useState("")
  const [material, setMaterial] = useState("")
  const [stock, setStock] = useState("")

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    colors: [],
    materials: []
  })

  const tabs = ["Images", "Details", "Pricing", "Meta"]

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes, colorsRes, materialsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/filter/type/brand`),
          axios.get(`${backendUrl}/api/filter/type/color`),
          axios.get(`${backendUrl}/api/filter/type/material`)
        ])
        
        setFilterOptions({
          brands: brandsRes.data.data || [],
          colors: colorsRes.data.data || [],
          materials: materialsRes.data.data || []
        })
      } catch (error) {
        console.log('Failed to fetch filter options:', error)
      }
    }

    fetchFilterOptions()
  }, [])

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          return false
        }
        return true
      })
      
      if (images.length + newImages.length > 4) {
        toast.error('Maximum 4 images allowed')
        return
      }
      
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Get available sizes based on subcategory
  const getSizeOptions = () => {
    if (subCategory === 'Bottomwear') {
      return [28, 30, 32, 34, 36, 38, 40, 42, 44]
    }
    return ['S', 'M', 'L', 'XL', 'XXL']
  }

  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Product name is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!price) newErrors.price = 'Price is required'
    if (images.length === 0) newErrors.images = 'At least one image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("brand", brand)
      formData.append("color", color)
      formData.append("material", material)
      formData.append("stock", JSON.stringify(sizeQuantities))

      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image)
      })

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})

      if (response.data.success) {
        toast.success('✨ Product added successfully!')
        setName('')
        setDescription('')
        setImages([])
        setBrand('')
        setColor('')
        setMaterial('')
        setPrice('')
        setStock('')
        setSizes([])
        setSizeQuantities({})
        setBestseller(false)
        setCategory("Men")
        setSubCategory("Topwear")
        setActiveTab(0)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

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
          Add New Product
        </h1>
        <p className='text-gray-500 mt-2'>Create and manage your product inventory with ease</p>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 border-b border-gray-200'>
              <div className='flex gap-1 overflow-x-auto'>
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === idx
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className='space-y-6'>
        
        {/* TAB 0: Images */}
        {activeTab === 0 && (
          <div className='space-y-6'>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <p className='text-blue-800 text-sm flex items-center gap-2'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
                </svg>
                Add 1-4 product images. Drag & drop multiple images at once!
              </p>
            </div>

            {/* Bulk Image Upload Area */}
            <div 
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
                const files = e.dataTransfer.files
                const input = document.getElementById('bulkImageUpload')
                input.files = files
                handleImageUpload({target: {files}})
              }}
              className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors text-center'
            >
              <label htmlFor='bulkImageUpload' className='cursor-pointer block'>
                <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
                </svg>
                <p className='text-lg font-semibold text-gray-700 mb-2'>Drag & drop images here</p>
                <p className='text-gray-500 text-sm mb-4'>or click to select</p>
                <p className='text-xs text-gray-400'>Supports up to 4 images, max 5MB each (JPG, PNG, WebP)</p>
              </label>
              <input 
                id='bulkImageUpload'
                onChange={handleImageUpload}
                type="file" 
                hidden 
                multiple
                accept='image/*'
              />
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900'>Uploaded Images ({images.length}/4)</h3>
                  {images.length > 0 && (
                    <button
                      type='button'
                      onClick={() => setImages([])}
                      className='text-sm text-red-600 hover:text-red-700 font-medium'
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {images.map((image, index) => (
                    <div key={index} className='relative group'>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className='w-full h-32 object-cover rounded-lg group-hover:opacity-75 transition-opacity border-2 border-gray-200'
                      />
                      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black/50'>
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors'
                        >
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' />
                          </svg>
                        </button>
                      </div>
                      <span className='absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold'>
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.images && (
              <p className='text-red-500 text-sm flex items-center gap-2'>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
                </svg>
                {errors.images}
              </p>
            )}

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                disabled={true}
                className='px-4 py-2 text-gray-400 cursor-not-allowed'
              >
                ← Previous
              </button>
              <button
                type='button'
                onClick={() => setActiveTab(1)}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: Details */}
        {activeTab === 1 && (
          <div className='space-y-6'>
            {/* Product Name */}
            <div className='form-group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Product Name *
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder='e.g., Premium Cotton T-Shirt'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
            </div>

            {/* Description */}
            <div className='form-group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Description *
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder='Write a detailed product description...'
                rows="5"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                  errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description}</p>}
            </div>

            {/* Category & Sub-category */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              <div className='form-group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Category
                </label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                >
                  <option value="Men">👔 Men</option>
                  <option value="Women">👗 Women</option>
                  <option value="Kids">👶 Kids</option>
                </select>
              </div>

              <div className='form-group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Sub-category
                </label>
                <select
                  onChange={(e) => {
                    setSubCategory(e.target.value)
                    setSizes([])
                    setSizeQuantities({})
                  }}
                  value={subCategory}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                >
                  <option value="Topwear">👕 Topwear</option>
                  <option value="Bottomwear">👖 Bottomwear</option>
                  <option value="Winterwear">🧥 Winterwear</option>
                </select>
              </div>
            </div>

            {/* Brand, Color & Material */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
              <div className='form-group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Brand (Optional)
                </label>
                <select
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                >
                  <option value="">-- Select Brand --</option>
                  {filterOptions.brands.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.icon ? `${b.icon} ${b.displayName || b.name}` : b.displayName || b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Color (Optional)
                </label>
                <select
                  onChange={(e) => setColor(e.target.value)}
                  value={color}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                >
                  <option value="">-- Select Color --</option>
                  {filterOptions.colors.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.icon ? `${c.icon} ${c.displayName || c.name}` : c.displayName || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Material (Optional)
                </label>
                <select
                  onChange={(e) => setMaterial(e.target.value)}
                  value={material}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                >
                  <option value="">-- Select Material --</option>
                  {filterOptions.materials.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.icon ? `${m.icon} ${m.displayName || m.name}` : m.displayName || m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bestseller Checkbox */}
            <div className='flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg'>
              <input
                onChange={() => setBestseller(prev => !prev)}
                checked={bestseller}
                type="checkbox"
                id='bestseller'
                className='w-5 h-5 text-purple-600 rounded'
              />
              <label className='cursor-pointer flex items-center gap-2' htmlFor="bestseller">
                <span>⭐ Add to Bestsellers</span>
                <span className='text-xs text-purple-600'>Featured in top collections</span>
              </label>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab(0)}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                ← Previous
              </button>
              <button
                type='button'
                onClick={() => setActiveTab(2)}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Pricing & Sizes */}
        {activeTab === 2 && (
          <div className='space-y-6'>
            {/* Price */}
            <div className='form-group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Price (₹) *
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                placeholder='0'
                className={`w-full md:w-48 px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  errors.price ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price}</p>}
            </div>

            {/* Stock Quantity Overview */}
            <div className='form-group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Stock Quantity *
              </label>
              <input
                type='number'
                placeholder='0'
                min='0'
                disabled
                value={Object.values(sizeQuantities).reduce((sum, qty) => sum + (Number(qty) || 0), 0)}
                className='w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 focus:outline-none transition-colors'
              />
              <p className='text-xs text-gray-500 mt-1'>Total units available for sale (calculated from sizes below)</p>
            </div>

            {/* Sizes & Stock per Size */}
            <div className='form-group'>
              <label className='block text-sm font-semibold text-gray-700 mb-4'>
                Available Sizes & Stock Quantities *
              </label>
              
              {/* Size Selection Buttons */}
              <div className='flex flex-wrap gap-3 mb-6'>
                {getSizeOptions().map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => {
                      if (sizes.includes(size)) {
                        setSizes(prev => prev.filter(s => s !== size))
                        setSizeQuantities(prev => {
                          const updated = {...prev}
                          delete updated[size]
                          return updated
                        })
                      } else {
                        setSizes(prev => [...prev, size])
                        setSizeQuantities(prev => ({...prev, [size]: ''}))
                      }
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                      sizes.includes(size)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Quantity Inputs for Selected Sizes */}
              {sizes.length > 0 ? (
                <div className='bg-gray-50 p-4 rounded-lg space-y-3 mb-4'>
                  <p className='text-sm font-semibold text-gray-700 mb-4'>Stock quantities for selected sizes:</p>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                    {sizes.map((size) => (
                      <div key={size} className='form-group'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                          Size {size} *
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder='Qty'
                          value={sizeQuantities[size] || ''}
                          onChange={(e) => setSizeQuantities(prev => ({
                            ...prev,
                            [size]: e.target.value
                          }))}
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className='text-xs text-gray-500 text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                  Select at least one size and enter stock quantity for each
                </p>
              )}
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab(1)}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                ← Previous
              </button>
              <button
                type='button'
                onClick={() => setActiveTab(3)}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Review */}
        {activeTab === 3 && (
          <div className='space-y-6'>
            <div className='bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200'>
              <h3 className='text-lg font-bold text-gray-800'>Review Your Product</h3>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded border border-gray-200'>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Product Name</p>
                  <p className='text-lg font-semibold mt-1'>{name || '—'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Price</p>
                  <p className='text-lg font-semibold mt-1'>₹{price || '0'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Category</p>
                  <p className='text-lg font-semibold mt-1'>{category}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Sub-category</p>
                  <p className='text-lg font-semibold mt-1'>{subCategory}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Sizes</p>
                  <p className='text-lg font-semibold mt-1'>{sizes.length > 0 ? sizes.join(', ') : '—'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Bestseller</p>
                  <p className='text-lg font-semibold mt-1'>{bestseller ? '⭐ Yes' : 'No'}</p>
                </div>
              </div>

              <div>
                <p className='text-xs text-gray-600 uppercase font-semibold mb-2'>Description</p>
                <p className='text-gray-700 whitespace-pre-wrap'>{description}</p>
              </div>

              <div>
                <p className='text-xs text-gray-600 uppercase font-semibold mb-3'>Images</p>
                <div className='flex gap-3 flex-wrap'>
                  {images.map((img, idx) => (
                    <img key={`preview-${idx + 1}`} src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} className='w-20 h-20 object-cover rounded-lg' />
                  ))}
                </div>
              </div>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab(2)}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                ← Back
              </button>
              <button
                type='submit'
                disabled={loading}
                className='px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 font-semibold'
              >
                {loading ? (
                  <>
                    <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default Add