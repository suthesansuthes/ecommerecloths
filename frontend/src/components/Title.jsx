import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='flex flex-col items-center gap-3 mb-8 py-4'>
      <div className='flex items-center gap-2'>
        <div className='w-8 sm:w-10 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded'></div>
        <span className='text-accent'>{text1}</span>
        <div className='w-8 sm:w-10 h-1 bg-gradient-to-l from-yellow-400 to-yellow-500 rounded'></div>
      </div>
      <h2 className='text-center'>
        {text2}
      </h2>
    </div>
  )
}

export default Title
