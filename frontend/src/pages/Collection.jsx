import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import AdvancedFilters from '../components/AdvancedFilters';
import ActiveFiltersDisplay from '../components/ActiveFiltersDisplay';

const Collection = () => {

  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    // Price filter
    productsCopy = productsCopy.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])

    // Size filter
    if (selectedSizes.length > 0) {
      productsCopy = productsCopy.filter(item => 
        item.sizes && item.sizes.some(size => selectedSizes.includes(size))
      )
    }

    // Rating filter (minimum rating)
    if (selectedRating.length > 0) {
      const minRating = Math.min(...selectedRating)
      productsCopy = productsCopy.filter(item => (item.rating || 0) >= minRating)
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      productsCopy = productsCopy.filter(item => selectedBrands.includes(item.brand))
    }

    // Color filter
    if (selectedColors.length > 0) {
      productsCopy = productsCopy.filter(item => selectedColors.includes(item.color))
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      productsCopy = productsCopy.filter(item => selectedMaterials.includes(item.material))
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products,priceRange,selectedSizes,selectedRating,selectedBrands,selectedColors,selectedMaterials])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  const handleRemoveFilter = (filterType, value) => {
    switch(filterType) {
      case 'category':
        setCategory(prev => prev.filter(item => item !== value))
        break
      case 'subcategory':
        setSubCategory(prev => prev.filter(item => item !== value))
        break
      case 'price':
        setPriceRange([0, 10000])
        break
      case 'size':
        setSelectedSizes(prev => prev.filter(item => item !== value))
        break
      case 'rating':
        setSelectedRating(prev => prev.filter(item => item !== value))
        break
      case 'brand':
        setSelectedBrands(prev => prev.filter(item => item !== value))
        break
      case 'color':
        setSelectedColors(prev => prev.filter(item => item !== value))
        break
      case 'material':
        setSelectedMaterials(prev => prev.filter(item => item !== value))
        break
      default:
        break
    }
  }

  return (
    <div className='pt-4 sm:pt-6 pb-12'>
      <div className='mb-6 sm:mb-8'>
        <Title text1={'OUR'} text2={'COLLECTION'} />
      </div>

      <div className='flex flex-col lg:flex-row gap-6 lg:gap-12'>
        
        {/* Filter Sidebar */}
        <div className='lg:w-80 flex-shrink-0'>
          <button
            onClick={()=>setShowFilter(!showFilter)}
            className='lg:hidden w-full flex items-center justify-between mb-4 px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-xl hover:shadow-md transition-all font-semibold text-sm'
          >
            <div className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
              </svg>
              <span>Filters</span>
              {(category.length > 0 || subCategory.length > 0 || selectedSizes.length > 0) && (
                <span className='bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                  {category.length + subCategory.length + selectedSizes.length}
                </span>
              )}
            </div>
            <svg className={`w-5 h-5 transition-transform ${showFilter ? 'rotate-180' : ''}`} fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
          </button>

          <div className={`bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm ${showFilter ? '' : 'hidden lg:block'}`}>
            <AdvancedFilters
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedMaterials={selectedMaterials}
              setSelectedMaterials={setSelectedMaterials}
              onClearFilters={() => {
                setCategory([]);
                setSubCategory([]);
                setPriceRange([0, 10000]);
                setSelectedSizes([]);
                setSelectedRating([]);
                setSelectedBrands([]);
                setSelectedColors([]);
                setSelectedMaterials([]);
              }}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className='flex-1'>
          {/* Header with Sort */}
          <div className='flex items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-gray-200'>
            <p className='text-gray-600 text-xs sm:text-sm font-medium'>
              <span className='font-bold text-gray-900'>{filterProducts.length}</span> products
            </p>
            
            <div className='flex items-center gap-2 sm:gap-3'>
              <select
                onChange={(e)=>setSortType(e.target.value)}
                className='px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold bg-white'
              >
                <option value="relavent">Relevant</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <ActiveFiltersDisplay
            category={category}
            subCategory={subCategory}
            priceRange={priceRange}
            selectedSizes={selectedSizes}
            selectedRating={selectedRating}
            selectedBrands={selectedBrands}
            selectedColors={selectedColors}
            selectedMaterials={selectedMaterials}
            onRemoveFilter={handleRemoveFilter}
          />

          {/* Products Grid */}
          {filterProducts.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
              {filterProducts.map((item, index)=>(
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} stock={item.stock} />
              ))}
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>🔍</div>
              <p className='text-gray-600 text-lg mb-2 font-semibold'>No products found</p>
              <p className='text-gray-500 text-sm mb-6'>Try adjusting your filters to find what you're looking for</p>
              <div className='space-y-2'>
                <button
                  onClick={() => {
                    setCategory([]);
                    setSubCategory([]);
                    setPriceRange([0, 10000]);
                    setSelectedSizes([]);
                    setSelectedRating([]);
                  }}
                  className='inline-block py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold'
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
