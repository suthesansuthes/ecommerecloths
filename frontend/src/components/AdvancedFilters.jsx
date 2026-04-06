import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const AdvancedFilters = ({
  category = [],
  setCategory,
  subCategory = [],
  setSubCategory,
  priceRange = [0, 10000],
  setPriceRange,
  selectedSizes = [],
  setSelectedSizes,
  selectedRating = [],
  setSelectedRating,
  selectedBrands = [],
  setSelectedBrands,
  selectedColors = [],
  setSelectedColors,
  selectedMaterials = [],
  setSelectedMaterials,
  onClearFilters
}) => {
  const { backendUrl } = useContext(ShopContext)
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    colors: [],
    materials: []
  })
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    type: true,
    brands: true,
    colors: true,
    materials: true,
    price: true,
    size: true,
    rating: true
  })

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoadingFilters(true)
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
      } finally {
        setLoadingFilters(false)
      }
    }

    fetchFilterOptions()
  }, [backendUrl])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleCategory = (e) => {
    const value = e.target.value
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value))
    } else {
      setCategory(prev => [...prev, value])
    }
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    if (subCategory.includes(value)) {
      setSubCategory(prev => prev.filter(item => item !== value))
    } else {
      setSubCategory(prev => [...prev, value])
    }
  }

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(prev => prev.filter(item => item !== size))
    } else {
      setSelectedSizes(prev => [...prev, size])
    }
  }

  const toggleRating = (rating) => {
    if (selectedRating.includes(rating)) {
      setSelectedRating(prev => prev.filter(item => item !== rating))
    } else {
      setSelectedRating(prev => [...prev, rating])
    }
  }

  const toggleBrand = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(prev => prev.filter(item => item !== brandName))
    } else {
      setSelectedBrands(prev => [...prev, brandName])
    }
  }

  const toggleColor = (colorName) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(prev => prev.filter(item => item !== colorName))
    } else {
      setSelectedColors(prev => [...prev, colorName])
    }
  }

  const toggleMaterial = (materialName) => {
    if (selectedMaterials.includes(materialName)) {
      setSelectedMaterials(prev => prev.filter(item => item !== materialName))
    } else {
      setSelectedMaterials(prev => [...prev, materialName])
    }
  }

  const isAnyFilterActive = category.length > 0 || subCategory.length > 0 || 
                            selectedSizes.length > 0 || selectedRating.length > 0 ||
                            selectedBrands.length > 0 || selectedColors.length > 0 ||
                            selectedMaterials.length > 0 ||
                            priceRange[0] !== 0 || priceRange[1] !== 10000

  const FilterSection = ({ title, section, children }) => (
    <div className='border-b border-gray-200 pb-6 last:border-b-0'>
      <button
        onClick={() => toggleSection(section)}
        className='flex items-center justify-between w-full py-2 hover:text-gray-900 transition-colors group'
      >
        <h3 className='font-bold text-gray-900 text-sm uppercase tracking-widest group-hover:text-blue-600'>
          {title}
        </h3>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            expandedSections[section] ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
        </svg>
      </button>
      {expandedSections[section] && (
        <div className='mt-4 space-y-3'>
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className='space-y-0'>
      {/* Active Filters Count Badge */}
      {isAnyFilterActive && (
        <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between'>
          <span className='text-sm font-semibold text-blue-700'>
            🔍 {category.length + subCategory.length + selectedSizes.length + selectedRating.length} Active Filters
          </span>
        </div>
      )}

      {/* Category Filter */}
      <FilterSection title='Categories' section='category'>
        {['Men', 'Women', 'Kids'].map((cat) => (
          <label key={cat} className='flex items-center cursor-pointer group'>
            <input
              className='w-4 h-4 rounded border-gray-300 accent-blue-600'
              type='checkbox'
              value={cat}
              checked={category.includes(cat)}
              onChange={toggleCategory}
            />
            <span className='ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors'>
              {cat}
            </span>
            {category.includes(cat) && (
              <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
            )}
          </label>
        ))}
      </FilterSection>

      {/* Type/SubCategory Filter */}
      <FilterSection title='Type' section='type'>
        {['Topwear', 'Bottomwear', 'Winterwear'].map((sub) => (
          <label key={sub} className='flex items-center cursor-pointer group'>
            <input
              className='w-4 h-4 rounded border-gray-300 accent-blue-600'
              type='checkbox'
              value={sub}
              checked={subCategory.includes(sub)}
              onChange={toggleSubCategory}
            />
            <span className='ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors'>
              {sub}
            </span>
            {subCategory.includes(sub) && (
              <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
            )}
          </label>
        ))}
      </FilterSection>

      {/* Brands Filter */}
      {filterOptions.brands.length > 0 && (
        <FilterSection title='Brands' section='brands'>
          {filterOptions.brands.map((brand) => (
            <label key={brand.name} className='flex items-center cursor-pointer group'>
              <input
                className='w-4 h-4 rounded border-gray-300 accent-blue-600'
                type='checkbox'
                checked={selectedBrands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
              />
              <span className='ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-2'>
                {brand.icon && <span className='text-lg'>{brand.icon}</span>}
                {brand.displayName || brand.name}
              </span>
              {selectedBrands.includes(brand.name) && (
                <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
              )}
            </label>
          ))}
        </FilterSection>
      )}

      {/* Colors Filter */}
      {filterOptions.colors.length > 0 && (
        <FilterSection title='Colors' section='colors'>
          <div className='space-y-3'>
            {filterOptions.colors.map((color) => (
              <label key={color.name} className='flex items-center cursor-pointer group'>
                <input
                  className='w-4 h-4 rounded border-gray-300 accent-blue-600'
                  type='checkbox'
                  checked={selectedColors.includes(color.name)}
                  onChange={() => toggleColor(color.name)}
                />
                <span className='ml-3 flex items-center gap-2 flex-1'>
                  {color.colorCode && (
                    <div
                      className='w-6 h-6 rounded-lg border-2 border-gray-300'
                      style={{ backgroundColor: color.colorCode }}
                      title={color.colorCode}
                    ></div>
                  )}
                  <span className='text-sm text-gray-700 group-hover:text-gray-900 transition-colors'>
                    {color.icon && <span>{color.icon}</span>}
                    {color.displayName || color.name}
                  </span>
                </span>
                {selectedColors.includes(color.name) && (
                  <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
                )}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Materials Filter */}
      {filterOptions.materials.length > 0 && (
        <FilterSection title='Materials' section='materials'>
          {filterOptions.materials.map((material) => (
            <label key={material.name} className='flex items-center cursor-pointer group'>
              <input
                className='w-4 h-4 rounded border-gray-300 accent-blue-600'
                type='checkbox'
                checked={selectedMaterials.includes(material.name)}
                onChange={() => toggleMaterial(material.name)}
              />
              <span className='ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-2'>
                {material.icon && <span className='text-lg'>{material.icon}</span>}
                {material.displayName || material.name}
              </span>
              {selectedMaterials.includes(material.name) && (
                <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
              )}
            </label>
          ))}
        </FilterSection>
      )}

      {/* Price Range Filter */}
      <FilterSection title='Price Range' section='price'>
        <div className='space-y-4'>
          <div>
            <div className='flex justify-between text-sm font-semibold text-gray-900 mb-2'>
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            
            <input
              type='range'
              min='0'
              max='10000'
              step='100'
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
              className='w-full accent-blue-600'
            />
            
            <div className='mt-2 flex gap-2'>
              <input
                type='range'
                min='0'
                max='10000'
                step='100'
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                className='w-full accent-blue-600'
              />
            </div>

            <div className='mt-3 flex gap-2'>
              <input
                type='number'
                min='0'
                max='10000'
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value) || 0, priceRange[1]), priceRange[1]])}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Min'
              />
              <input
                type='number'
                min='0'
                max='10000'
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value) || 10000, priceRange[0])])}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Max'
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title='Size' section='size'>
        <div className='grid grid-cols-3 gap-2'>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all border-2 ${
                selectedSizes.includes(size)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title='Rating' section='rating'>
        <div className='space-y-3'>
          {[5, 4, 3, 2, 1].map((stars) => (
            <label key={stars} className='flex items-center cursor-pointer group'>
              <input
                type='checkbox'
                checked={selectedRating.includes(stars)}
                onChange={() => toggleRating(stars)}
                className='w-4 h-4 rounded border-gray-300 accent-blue-600'
              />
              <div className='ml-3 flex items-center gap-2'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='text-sm text-gray-700 group-hover:text-gray-900'>
                  {stars} Stars & Up
                </span>
              </div>
              {selectedRating.includes(stars) && (
                <div className='ml-auto w-2 h-2 bg-blue-600 rounded-full'></div>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters Button */}
      {isAnyFilterActive && (
        <div className='pt-4 sticky bottom-0 bg-white'>
          <button
            onClick={onClearFilters}
            className='w-full py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105'
          >
            🗑️ Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
