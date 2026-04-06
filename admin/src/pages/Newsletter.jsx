import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Newsletter = ({ token }) => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-newest')

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/newsletter/subscribers', {
        headers: { token }
      })
      if (response.data.success) {
        setSubscribers(response.data.subscribers)
        toast.success(`Loaded ${response.data.count} subscribers`)
      } else {
        toast.error(response.data.message)
        setSubscribers([])
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch subscribers')
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort subscribers
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    switch (sortBy) {
      case 'date-newest':
        return new Date(b.subscribedAt) - new Date(a.subscribedAt)
      case 'date-oldest':
        return new Date(a.subscribedAt) - new Date(b.subscribedAt)
      case 'email-asc':
        return a.email.localeCompare(b.email)
      case 'email-desc':
        return b.email.localeCompare(a.email)
      default:
        return 0
    }
  })

  // Download as CSV
  const downloadAsCSV = () => {
    if (sortedSubscribers.length === 0) {
      toast.error('No subscribers to download')
      return
    }

    const headers = ['Email', 'Subscribed Date', 'Subscribed Time']
    const data = sortedSubscribers.map(sub => {
      const date = new Date(sub.subscribedAt)
      return [
        sub.email,
        date.toLocaleDateString(),
        date.toLocaleTimeString()
      ]
    })

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    toast.success('Downloaded CSV successfully!')
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    const emails = sortedSubscribers.map(sub => sub.email).join(', ')
    navigator.clipboard.writeText(emails)
    toast.success('Copied all emails to clipboard!')
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Newsletter Subscribers</h1>
          <p className='text-gray-600 mt-2'>Manage and view all newsletter subscriptions</p>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={downloadAsCSV}
            className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
            Download CSV
          </button>
          <button
            onClick={copyToClipboard}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M8 3a1 1 0 011-1h2a1 1 0 011 1v1h2V4a2 2 0 10-4 0v-1zm3 4a1 1 0 01.967.852l.025.144V8h4a1 1 0 110 2H4a1 1 0 110-2h4V7.996l.025-.144A1 1 0 0111 7z' />
            </svg>
            Copy All Emails
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-lg p-6 border border-gray-200 shadow-sm'>
          <p className='text-gray-600 text-sm font-medium'>Total Subscribers</p>
          <p className='text-4xl font-bold text-gray-900 mt-2'>{subscribers.length}</p>
        </div>
        <div className='bg-white rounded-lg p-6 border border-gray-200 shadow-sm'>
          <p className='text-gray-600 text-sm font-medium'>Filtered Results</p>
          <p className='text-4xl font-bold text-blue-600 mt-2'>{sortedSubscribers.length}</p>
        </div>
        <div className='bg-white rounded-lg p-6 border border-gray-200 shadow-sm'>
          <p className='text-gray-600 text-sm font-medium'>Last Updated</p>
          <p className='text-gray-900 mt-2 font-semibold'>
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className='bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Search Email</label>
            <input
              type='text'
              placeholder='Search by email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
            >
              <option value='date-newest'>Date (Newest First)</option>
              <option value='date-oldest'>Date (Oldest First)</option>
              <option value='email-asc'>Email (A-Z)</option>
              <option value='email-desc'>Email (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='text-gray-600 mt-4'>Loading subscribers...</p>
          </div>
        ) : sortedSubscribers.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Email</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Subscribed Date</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Subscribed Time</th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSubscribers.map((subscriber, index) => {
                    const date = new Date(subscriber.subscribedAt)
                    return (
                      <tr key={subscriber._id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='px-6 py-4 text-sm text-gray-900 font-medium'>{subscriber.email}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{date.toLocaleDateString()}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{date.toLocaleTimeString()}</td>
                        <td className='px-6 py-4 text-center'>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(subscriber.email)
                              toast.success('Email copied!')
                            }}
                            className='text-blue-600 hover:text-blue-800 font-semibold text-sm'
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='md:hidden space-y-4 p-4'>
              {sortedSubscribers.map(subscriber => {
                const date = new Date(subscriber.subscribedAt)
                return (
                  <div key={subscriber._id} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                    <p className='text-sm font-semibold text-gray-900 mb-3'>{subscriber.email}</p>
                    <div className='space-y-2 text-sm text-gray-600 mb-3'>
                      <p>📅 {date.toLocaleDateString()}</p>
                      <p>🕐 {date.toLocaleTimeString()}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(subscriber.email)
                        toast.success('Email copied!')
                      }}
                      className='w-full py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-colors'
                    >
                      Copy Email
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className='p-8 text-center'>
            <p className='text-gray-600 text-lg'>
              {searchTerm ? 'No subscribers found matching your search' : 'No subscribers yet'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {subscribers.length > 0 && (
        <div className='mt-6 text-center text-sm text-gray-600'>
          Showing {sortedSubscribers.length} of {subscribers.length} subscribers
        </div>
      )}
    </div>
  )
}

export default Newsletter
