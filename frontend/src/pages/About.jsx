import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  const features = [
    {
      icon: '⭐',
      title: 'Quality Assurance',
      description: 'We meticulously select and vet each product to ensure it meets our stringent quality standards.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🚀',
      title: 'Convenience',
      description: 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '💬',
      title: 'Exceptional Customer Service',
      description: 'Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 md:py-24 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-6 mb-12 overflow-hidden'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl'></div>
          <div className='absolute -bottom-8 right-10 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl'></div>
        </div>
        <div className='relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center'>
          <h1 className='text-white mb-4'>About Forever</h1>
          <p className='text-xl text-gray-300'>Your trusted destination for premium fashion and lifestyle products</p>
        </div>
      </div>

      {/* About Content Section */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          {/* Image */}
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity'></div>
            <img src={assets.about_img} alt="About Forever" className='relative w-full rounded-2xl shadow-2xl object-cover h-96' />
          </div>

          {/* Content */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3'>
                <span className='text-4xl'>📖</span>
                Our Story
              </h2>
              <p className='text-gray-700 leading-relaxed mb-4'>
                Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
              </p>
            </div>

            <div className='bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100'>
              <h3 className='text-xl font-bold text-gray-900 mb-3 flex items-center gap-2'>
                <span className='text-2xl'>🎯</span>
                Our Mission
              </h3>
              <p className='text-gray-700'>
                To empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>Why Choose Forever?</h2>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>Discover what makes us different from the rest</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div key={index} className='group'>
              <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full'>
                {/* Icon */}
                <div className={`text-5xl mb-4 inline-block p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white transform group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className='text-xl font-bold text-gray-900 mb-3'>{feature.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{feature.description}</p>

                {/* Accent Bar */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} rounded-full mt-4 transition-all duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className='bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-20 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-16 overflow-hidden'>
        <div className='max-w-4xl mx-auto px-6 md:px-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            <div>
              <p className='text-4xl md:text-5xl font-bold mb-2'>50K+</p>
              <p className='text-gray-300'>Happy Customers</p>
            </div>
            <div>
              <p className='text-4xl md:text-5xl font-bold mb-2'>10K+</p>
              <p className='text-gray-300'>Products Available</p>
            </div>
            <div>
              <p className='text-4xl md:text-5xl font-bold mb-2'>5★</p>
              <p className='text-gray-300'>Average Rating</p>
            </div>
            <div>
              <p className='text-4xl md:text-5xl font-bold mb-2'>24/7</p>
              <p className='text-gray-300'>Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>Our Core Values</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow'>
            <div className='text-4xl flex-shrink-0'>✨</div>
            <div>
              <h4 className='font-bold text-gray-900 mb-2'>Excellence</h4>
              <p className='text-gray-700 text-sm'>We strive for excellence in every aspect of our business, from product quality to customer service.</p>
            </div>
          </div>
          <div className='flex gap-4 p-6 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow'>
            <div className='text-4xl flex-shrink-0'>💡</div>
            <div>
              <h4 className='font-bold text-gray-900 mb-2'>Innovation</h4>
              <p className='text-gray-700 text-sm'>Constantly innovating to bring new products and experiences to our customers.</p>
            </div>
          </div>
          <div className='flex gap-4 p-6 bg-green-50 rounded-xl border border-green-100 hover:shadow-lg transition-shadow'>
            <div className='text-4xl flex-shrink-0'>🤝</div>
            <div>
              <h4 className='font-bold text-gray-900 mb-2'>Integrity</h4>
              <p className='text-gray-700 text-sm'>Building trust through honest dealings and transparent communication with our customers.</p>
            </div>
          </div>
          <div className='flex gap-4 p-6 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow'>
            <div className='text-4xl flex-shrink-0'>🌍</div>
            <div>
              <h4 className='font-bold text-gray-900 mb-2'>Sustainability</h4>
              <p className='text-gray-700 text-sm'>Committed to sustainable practices that benefit our customers and the environment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
