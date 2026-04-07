import React from 'react'
import { assets } from '../assets/assets'
import NewsletterBox from './NewsletterBox'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-12 sm:mt-20'>
      {/* Newsletter Section */}
      <NewsletterBox />

      {/* Main Footer Content */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12 border-t border-gray-200'>
        
        {/* Brand Section - Full Width on Mobile */}
        <div className='col-span-2 md:col-span-1 space-y-4 mb-4 sm:mb-0'>
          <img src={assets.logo} className='w-28 sm:w-32' alt="Forever Logo" />
          <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
            Experience the latest in fashion with our curated collection of premium clothing.
          </p>
          <div className='flex gap-4 pt-2'>
            <a href='https://www.facebook.com/profile.php?id=61575451770582' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-blue-600 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>
            </a>
            <a href='https://wa.me/0768236808' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-green-500 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M17.6915026,3.92338367 C15.7226704,1.99788253 13.0252083,0.903148296 10.1000937,0.903148296 C5.10638154,0.903148296 1.15345488,4.84572893 1.15345488,9.84057595 C1.15345488,11.5779464 1.56322889,13.2624054 2.34151166,14.7459782 L1.01672286,19.0856207 L5.61214434,17.8267215 C7.06344088,18.5350722 8.73553964,18.9243213 10.4000937,18.9243213 L10.1000937,18.9243213 C15.0939146,18.9243213 19.0468413,15.0010641 19.0468413,10.0074088 C19.0468413,7.1016171 17.9610303,4.40289653 15.0915026,2.43401507 L17.6915026,3.92338367 Z M10.1000937,17.4170675 C8.63299863,17.4170675 7.2161156,17.0578339 5.99603501,16.3761674 L5.74976535,16.2408722 L2.92219951,16.9867482 L3.67599649,14.2517953 L3.50553434,14.0056962 C2.72559222,12.8430936 2.30154186,11.4306356 2.30154186,9.84057595 C2.30154186,5.52106166 5.73486206,2.09042908 10.1000937,2.09042908 C12.5907196,2.09042908 14.9596345,3.06218309 16.6282269,4.73109726 C18.2968192,6.40001143 19.2625685,8.76932401 19.2625685,10.2600826 C19.2625685,14.5793168 15.8288449,17.9939208 11.3000937,17.9939208 L10.1000937,17.4170675 Z M14.6563168,11.8189655 C14.4826232,11.7385327 13.5088775,11.2873485 13.3449494,11.2204243 C13.1810214,11.1535 13.0639907,11.1200879 12.9469599,11.2938552 C12.8299292,11.4676225 12.5163768,11.8633826 12.4160251,11.9804134 C12.3156734,12.0974442 12.2153216,12.1139266 12.041628,11.9401592 C11.8679344,11.7663919 11.3166086,11.596502 10.7400636,11.0604444 C10.2927022,10.6268439 9.98630259,10.0965656 9.88595088,9.92179826 C9.78559917,9.74703088 9.87546624,9.6545267 10.0492338,9.48075938 C10.2045932,9.32534852 10.3915646,9.08191061 10.5653322,8.98146889 C10.7390997,8.88102717 10.8560304,8.81039486 11.0199585,8.69336408 C11.1838865,8.5763333 11.1503744,8.39256597 11.0499227,8.21879863 C10.9494711,8.0450313 10.6427176,7.07449766 10.4955089,6.73004696 C10.3517722,6.39772734 10.2046635,6.44115258 10.0909259,6.43722455 C9.98485827,6.43329651 9.86781751,6.43329651 9.75078674,6.43329651 C9.63375598,6.43329651 9.46201122,6.48340571 9.29823758,6.65717305 C9.13446395,6.83094039 8.68369023,7.28303403 8.68369023,8.25356767 C8.68369023,9.2241013 9.31479901,10.1609147 9.41525072,10.2779455 C9.51570244,10.3949763 10.6394318,12.2282389 12.4160251,13.0920267 C13.5586407,13.6482821 14.4323482,13.9385116 15.0883965,14.1281227 C15.7443448,14.3177339 16.3677768,14.283969 16.8461455,14.1859345 C17.3768957,14.0738019 18.4610303,13.5287544 18.6078391,12.9448118 C18.7546478,12.3608691 18.7546478,11.8860154 18.6640141,11.7703218 C18.5733804,11.6546282 18.4564497,11.6215161 18.2827722,11.5410833 L14.6563168,11.8189655 Z'/></svg>
            </a>
            <a href='https://www.instagram.com/vibecode5395/?hl=en' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-pink-600 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wider'>Quick Links</h3>
          <ul className='space-y-2 sm:space-y-3'>
            <li><a href='/' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Home</a></li>
            <li><a href='/collection' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Shop</a></li>
            <li><a href='/about' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>About Us</a></li>
            <li><a href='/contact' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className='text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wider'>Customer Service</h3>
          <ul className='space-y-2 sm:space-y-3'>
            <li><a href='#' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Shipping Info</a></li>
            <li><a href='#' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Returns</a></li>
            <li><a href='#' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>FAQ</a></li>
            <li><a href='#' className='text-gray-600 hover:text-black transition-colors text-xs sm:text-sm'>Size Guide</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className='col-span-2 md:col-span-1'>
          <h3 className='text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wider'>Get In Touch</h3>
          <ul className='grid grid-cols-2 md:grid-cols-1 gap-3 sm:space-y-3'>
            <li className='text-gray-600 text-xs sm:text-sm'>
              <p className='font-medium text-gray-900'>Phone</p>
              <a href='tel:0768236808' className='hover:text-black transition-colors'>0768236808</a>
            </li>
            <li className='text-gray-600 text-xs sm:text-sm'>
              <p className='font-medium text-gray-900'>Email</p>
              <a href='mailto:vibecode5395@gmail.com' className='hover:text-black transition-colors break-all'>vibecode5395@gmail.com</a>
            </li>
            <li className='text-gray-600 text-xs sm:text-sm col-span-2 md:col-span-1'>
              <p className='font-medium text-gray-900'>Website</p>
              <a href='https://vibecodesoftwares.com' target='_blank' rel='noopener noreferrer' className='hover:text-black transition-colors'>vibecodesoftwares.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='border-t border-gray-200 py-6 sm:py-8'>
        <div className='flex flex-col items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600'>
          <p className='text-center'>&copy; {currentYear} Forever Fashion. All rights reserved.</p>
          <div className='flex gap-4 sm:gap-6 flex-wrap justify-center'>
            <a href='#' className='hover:text-black transition-colors'>Privacy</a>
            <a href='#' className='hover:text-black transition-colors'>Terms</a>
            <a href='#' className='hover:text-black transition-colors'>Cookies</a>
          </div>
          <div className='flex gap-2'>
            <img src={assets.logo} className='w-8' alt="Visa" />
            <img src={assets.logo} className='w-8' alt="Mastercard" />
            <img src={assets.logo} className='w-8' alt="Amex" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
