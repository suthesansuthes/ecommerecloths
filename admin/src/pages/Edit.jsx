import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ token }) => {
  const { productId } = useParams()
  const navigate = useNavigate()
  
  const [newImages, setNewImages] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [existingImages, setExistingImages] = useState([])

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

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    colors: [],
    materials: []
  })

  const tabs = ["Images", "Details", "Pricing"]

  // Fetch filter options
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

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setPageLoading(true)
        const response = await axios.post(backendUrl + '/api/product/single', { productId })
        
        if (response.data.success) {
          const product = response.data.product
          setName(product.name)
          setDescription(product.description)
          setPrice(product.price)
          setCategory(product.category)
          setSubCategory(product.subCategory)
          setBestseller(product.bestseller || false)
          setSizes(product.sizes || [])
          setBrand(product.brand || "")
          setColor(product.color || "")
          setMaterial(product.material || "")
          
          // Handle stock format - can be number or object with sizes
          if (typeof product.stock === 'object' && product.stock !== null) {
            setSizeQuantities(product.stock || {})
          } else {
            setStock(product.stock || "")
          }
          
          setExistingImages(product.image || [])
        } else {
          toast.error('Failed to load product')
          navigate('/list')
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to load product')
        navigate('/list')
      } finally {
        setPageLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, navigate])

  const handleImageUpload = (e, imageNum) => {
    const files = e.target.files
    if (files) {
      const newFilesToAdd = Array.from(files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`)
          return false
        }
        return true
      })
      
      if (existingImages.length + newImages.length + newFilesToAdd.length > 4) {
        toast.error('Maximum 4 images allowed')
        return
      }
      
      setNewImages(prev => [...prev, ...newFilesToAdd])
    }
  }

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
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
    if (existingImages.length === 0 && newImages.length === 0) newErrors.images = 'At least one image is required'
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

      formData.append("productId", productId)
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

      // Append new images
      newImages.forEach((image, index) => {
        formData.append(`image${existingImages.length + index + 1}`, image)
      })

      const response = await axios.post(backendUrl + "/api/product/update", formData, {headers: {token}})

      if (response.data.success) {
        toast.success('✨ Product updated successfully!')
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const renderImageUpload = (imageNum, imageState) => (
    <div className='flex flex-col items-center justify-center h-32 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50 cursor-pointer relative group'>
      <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer'>
        <svg className='w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 5V1m0 22v-4m11-11H1M10 3.22A6.985 6.985 0 0112 1c3.866 0 7 3.134 7 7 0 1.882-.755 3.578-1.974 4.8M2.974 11.8C1.755 10.578 1 8.882 1 7c0-3.866 3.134-7 7-7 1.882 0 3.578.755 4.8 1.974' />
        </svg>
        <span className='mt-2 text-sm text-gray-700'>Click to upload</span>
        <input
          type='file'
          hidden
          onChange={(e) => handleImageUpload(e, imageNum)}
          accept='image/*'
        />
      </label>
      {imageState && (
        <button
          type='button'
          onClick={() => removeImage(imageNum)}
          className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/>
          </svg>
        </button>
      )}
    </div>
  )

  if (pageLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <svg className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
          </svg>
          <p className='text-gray-600'>Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmitHandler} className='space-y-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Edit Product</h1>
        <button
          type='button'
          onClick={() => navigate('/list')}
          className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Back to List
        </button>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 border-b border-gray-200 bg-white rounded-t-lg p-4'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            type='button'
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === index
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: Images */}
      {activeTab === 0 && (
        <div className='space-y-6 bg-white p-6 rounded-lg border border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Product Images</h2>
          
          {/* Bulk Upload Area */}
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
              const input = document.getElementById('editBulkImageUpload')
              input.files = files
              handleImageUpload({target: {files}})
            }}
            className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors text-center'
          >
            <label htmlFor='editBulkImageUpload' className='cursor-pointer block'>
              <svg className='w-12 h-12 text-gray-400 mx-auto mb-3' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
              </svg>
              <p className='text-base font-semibold text-gray-700 mb-2'>Drag & drop images here</p>
              <p className='text-gray-500 text-sm mb-2'>or click to add new images</p>
              <p className='text-xs text-gray-400'>Supports up to {4 - existingImages.length} more images (max 5MB each)</p>
            </label>
            <input 
              id='editBulkImageUpload'
              onChange={handleImageUpload}
              type="file" 
              hidden 
              multiple
              accept='image/*'
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>Current Images ({existingImages.length})</h3>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {existingImages.map((img, idx) => (
                  <div key={idx} className='relative group'>
                    <img src={img} alt={`Product ${idx + 1}`} className='w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:opacity-75 transition-opacity' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black/50'>
                      <button
                        type='button'
                        onClick={() => removeExistingImage(idx)}
                        className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors'
                      >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/>
                        </svg>
                      </button>
                    </div>
                    <span className='absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-semibold'>
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>New Images ({newImages.length})</h3>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {newImages.map((img, idx) => (
                  <div key={idx} className='relative group'>
                    <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className='w-full h-32 object-cover rounded-lg border-2 border-blue-300 group-hover:opacity-75 transition-opacity' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black/50'>
                      <button
                        type='button'
                        onClick={() => removeNewImage(idx)}
                        className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors'
                      >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/>
                        </svg>
                      </button>
                    </div>
                    <span className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold'>
                      {existingImages.length + idx + 1}
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
        </div>
      )}

      {/* TAB 2: Details */}
      {activeTab === 1 && (
        <div className='space-y-6 bg-white p-6 rounded-lg border border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Product Name *</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                placeholder='e.g. Blue Cotton T-Shirt'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Category</label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              >
                <option value='Men'>Men</option>
                <option value='Women'>Women</option>
                <option value='Kids'>Kids</option>
              </select>
            </div>

            {/* SubCategory */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Sub Category</label>
              <select
                onChange={(e) => {
                  setSubCategory(e.target.value)
                  setSizes([])
                  setSizeQuantities({})
                }}
                value={subCategory}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              >
                <option value='Topwear'>Topwear</option>
                <option value='Bottomwear'>Bottomwear</option>
                <option value='Winterwear'>Winterwear</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Brand</label>
              <select
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              >
                <option value=''>--Select--</option>
                {filterOptions.brands.map((b) => (
                  <option key={b._id} value={b.displayName}>{b.displayName}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Color</label>
              <select
                onChange={(e) => setColor(e.target.value)}
                value={color}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              >
                <option value=''>--Select--</option>
                {filterOptions.colors.map((c) => (
                  <option key={c._id} value={c.displayName}>{c.displayName}</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Material</label>
              <select
                onChange={(e) => setMaterial(e.target.value)}
                value={material}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              >
                <option value=''>--Select--</option>
                {filterOptions.materials.map((m) => (
                  <option key={m._id} value={m.displayName}>{m.displayName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Description *</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder='Detailed product description...'
              rows='5'
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
              }`}
              required
            ></textarea>
            {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description}</p>}
          </div>

          {/* Bestseller */}
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={() => setBestseller(!bestseller)}
              checked={bestseller}
              type='checkbox'
              className='w-5 h-5 cursor-pointer'
            />
            <span className='text-sm font-semibold text-gray-700'>Mark as Bestseller</span>
          </label>
        </div>
      )}

      {/* TAB 3: Pricing & Stock */}
      {activeTab === 2 && (
        <div className='space-y-6 bg-white p-6 rounded-lg border border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Price */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Price (₹) *</label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type='number'
                placeholder='0'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                  errors.price ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price}</p>}
            </div>

            {/* Stock Quantity Overview */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Stock Quantity *
              </label>
              <input
                type='number'
                placeholder='0'
                min='0'
                disabled
                value={Object.values(sizeQuantities).reduce((sum, qty) => sum + (Number(qty) || 0), 0)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 focus:outline-none transition-colors'
              />
              <p className='text-xs text-gray-500 mt-1'>Total units available for sale (calculated from sizes below)</p>
            </div>
          </div>

          {/* Sizes & Stock per Size */}
          <div>
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
        </div>
      )}

      {/* TAB 4: Summary */}


      {/* Submit Button */}
      <div className='flex gap-4 pt-6'>
        <button
          type='submit'
          disabled={loading}
          className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? '⏳ Updating...' : '💾 Update Product'}
        </button>
        <button
          type='button'
          onClick={() => navigate('/list')}
          className='flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Edit
