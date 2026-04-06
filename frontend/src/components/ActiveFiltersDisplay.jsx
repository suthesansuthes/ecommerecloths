import React from 'react'

const ActiveFiltersDisplay = ({
  category = [],
  subCategory = [],
  priceRange = [0, 10000],
  selectedSizes = [],
  selectedRating = [],
  selectedBrands = [],
  selectedColors = [],
  selectedMaterials = [],
  onRemoveFilter
}) => {
  const hasActiveFilters = 
    category.length > 0 || 
    subCategory.length > 0 || 
    (priceRange[0] !== 0 || priceRange[1] !== 10000) ||
    selectedSizes.length > 0 || 
    selectedRating.length > 0 ||
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0

  if (!hasActiveFilters) return null

  return (
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest'>Active Filters</h3>
        <span className='text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
          {category.length + subCategory.length + selectedSizes.length + selectedRating.length + selectedBrands.length + selectedColors.length + selectedMaterials.length + (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0)}
        </span>
      </div>

      <div className='flex flex-wrap gap-2'>
        {/* Category Badges */}
        {category.map((cat) => (
          <div key={`cat-${cat}`} className='flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>📁 {cat}</span>
            <button
              onClick={() => onRemoveFilter('category', cat)}
              className='text-blue-700 hover:text-blue-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* SubCategory Badges */}
        {subCategory.map((sub) => (
          <div key={`sub-${sub}`} className='flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>👕 {sub}</span>
            <button
              onClick={() => onRemoveFilter('subcategory', sub)}
              className='text-purple-700 hover:text-purple-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* Price Badge */}
        {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
          <div className='flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>💰 ${priceRange[0]} - ${priceRange[1]}</span>
            <button
              onClick={() => onRemoveFilter('price', null)}
              className='text-green-700 hover:text-green-900 font-bold'
            >
              ✕
            </button>
          </div>
        )}

        {/* Size Badges */}
        {selectedSizes.map((size) => (
          <div key={`size-${size}`} className='flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>📏 {size}</span>
            <button
              onClick={() => onRemoveFilter('size', size)}
              className='text-orange-700 hover:text-orange-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* Rating Badges */}
        {selectedRating.map((rating) => (
          <div key={`rating-${rating}`} className='flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>⭐ {rating}+ Stars</span>
            <button
              onClick={() => onRemoveFilter('rating', rating)}
              className='text-yellow-700 hover:text-yellow-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* Brand Badges */}
        {selectedBrands.map((brand) => (
          <div key={`brand-${brand}`} className='flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>🏢 {brand}</span>
            <button
              onClick={() => onRemoveFilter('brand', brand)}
              className='text-indigo-700 hover:text-indigo-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* Color Badges */}
        {selectedColors.map((color) => (
          <div key={`color-${color}`} className='flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>🎨 {color}</span>
            <button
              onClick={() => onRemoveFilter('color', color)}
              className='text-pink-700 hover:text-pink-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}

        {/* Material Badges */}
        {selectedMaterials.map((material) => (
          <div key={`material-${material}`} className='flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full text-sm font-semibold'>
            <span>🧵 {material}</span>
            <button
              onClick={() => onRemoveFilter('material', material)}
              className='text-cyan-700 hover:text-cyan-900 font-bold'
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActiveFiltersDisplay
