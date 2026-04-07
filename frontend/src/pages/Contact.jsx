import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('✅ Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['market lane,', 'makiyapiddy sandilipay', 'jaffna'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['Tel: 0768236808', 'Available Mon-Fri', '10AM - 6PM'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📧',
      title: 'Email Us',
      details: ['vibecode5395@gmail.com', 'Web: vibecodesoftwares.com', 'Business Inquiries'],
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
          <h1 className='text-white mb-4'>Get In Touch</h1>
          <p className='text-xl text-gray-300'>We'd love to hear from you. Let's get in touch!</p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {contactMethods.map((method, index) => (
            <div key={index} className='group'>
              <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full text-center'>
                <div className={`text-6xl mb-4 inline-block p-6 rounded-2xl bg-gradient-to-br ${method.color} text-white transform group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <h3 className='text-gray-900 mb-4'>{method.title}</h3>
                <div className='space-y-2'>
                  {method.details.map((detail, i) => (
                    <p key={i} className='text-gray-600'>{detail}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start'>
          {/* Image */}
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity'></div>
            <img src={assets.contact_img} alt="Contact Forever" className='relative w-full rounded-2xl shadow-2xl object-cover h-96' />
          </div>

          {/* Contact Form */}
          <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Your Name *</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder='Kamal Perera'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white'
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address *</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder='kamal@gmail.com'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white'
                />
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='+94 771234567'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white'
                />
              </div>

              {/* Subject */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Subject *</label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder='How can we help?'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white'
                />
              </div>

              {/* Message */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Message *</label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder='Tell us more about your query...'
                  rows='5'
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white resize-none'
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 transform disabled:opacity-70 flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>✉️ Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Careers Section */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl mx-4 sm:mx-6 lg:mx-8 p-12 mb-16 border border-blue-100'>
        <div className='max-w-4xl'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3'>
            <span className='text-4xl'>💼</span>
            Careers at Forever
          </h2>
          <p className='text-gray-700 mb-6'>
            Join our growing team of passionate individuals dedicated to revolutionizing online shopping. We're always looking for talented people to help us achieve our mission.
          </p>
          <button className='btn-primary px-8 py-3 inline-flex items-center gap-2'>
            🚀 Explore Job Openings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
