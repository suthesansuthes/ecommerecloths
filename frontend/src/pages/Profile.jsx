import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Profile = () => {

  const { token, navigate } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    avatar: '👤'
  })
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipcode: '400001',
      country: 'India',
      isDefault: true
    }
  ])
  const [newAddress, setNewAddress] = useState(null)

  if (!token) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
          </svg>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Sign in to account</h2>
          <p className='text-gray-600 mb-6'>Please login to view your profile and orders</p>
          <button
            onClick={() => navigate('/login')}
            className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ACCOUNT'} />
        <p className='text-gray-600 mt-2'>Manage your profile and preferences</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        
        {/* Sidebar */}
        <div className='lg:col-span-1'>
          <div className='sticky top-4 space-y-2'>
            {[
              {id: 'profile', label: 'Profile', icon: '👤'},
              {id: 'addresses', label: 'Addresses', icon: '📍'},
              {id: 'preferences', label: 'Preferences', icon: '⚙️'},
              {id: 'security', label: 'Security', icon: '🔒'},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setEditMode(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='mr-2'>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className='lg:col-span-3'>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-start justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Profile Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className='px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold'
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {/* Avatar */}
              <div className='mb-8 text-center'>
                <div className='text-6xl mb-3'>{profileData.avatar}</div>
                <p className='text-gray-600 text-sm'>Account Avatar</p>
              </div>

              {/* Profile Fields */}
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>First Name</label>
                    <input
                      disabled={!editMode}
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                      type="text"
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Last Name</label>
                    <input
                      disabled={!editMode}
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
                  <input
                    disabled={!editMode}
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                    type="email"
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Phone Number</label>
                  <input
                    disabled={!editMode}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                    type="tel"
                  />
                </div>
              </div>

              {editMode && (
                <div className='mt-6 flex gap-3'>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      toast.success('✅ Profile updated!')
                    }}
                    className='flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold'
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Saved Addresses</h2>
                <button
                  onClick={() => setNewAddress({
                    type: 'Other',
                    firstName: '',
                    lastName: '',
                    street: '',
                    city: '',
                    state: '',
                    zipcode: '',
                    country: '',
                    isDefault: false
                  })}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
                >
                  + Add New Address
                </button>
              </div>

              {/* Address List */}
              <div className='space-y-4 mb-6'>
                {addresses.map(addr => (
                  <div key={addr.id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full'>
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className='px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full'>
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toast.info('Edit functionality')}
                        className='text-blue-600 text-sm font-semibold hover:text-blue-700'
                      >
                        Edit
                      </button>
                    </div>
                    <p className='text-gray-900 font-semibold'>{addr.firstName} {addr.lastName}</p>
                    <p className='text-gray-700'>{addr.street}</p>
                    <p className='text-gray-700'>{addr.city}, {addr.state} {addr.zipcode}</p>
                    <p className='text-gray-700'>{addr.country}</p>
                  </div>
                ))}
              </div>

              {/* New Address Form */}
              {newAddress && (
                <div className='border-t border-gray-200 pt-6'>
                  <h3 className='font-semibold text-gray-900 mb-4'>Add New Address</h3>
                  <div className='space-y-3 max-h-96 overflow-y-auto'>
                    <input
                      placeholder='Address Type (e.g., Home, Office)'
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='First Name'
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Last Name'
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <input
                      placeholder='Street'
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='City'
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='State'
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='Zipcode'
                        value={newAddress.zipcode}
                        onChange={(e) => setNewAddress({...newAddress, zipcode: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Country'
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='flex gap-3'>
                      <button
                        onClick={() => {
                          setAddresses([...addresses, {...newAddress, id: Date.now()}])
                          setNewAddress(null)
                          toast.success('✅ Address added!')
                        }}
                        className='flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold'
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setNewAddress(null)}
                        className='flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Notification Preferences</h2>
              
              <div className='space-y-4'>
                {[
                  {label: 'Order Updates', desc: 'Get notified about order status changes'},
                  {label: 'New Arrivals', desc: 'Be the first to know about new products'},
                  {label: 'Exclusive Offers', desc: 'Receive exclusive discounts and promotions'},
                  {label: 'Marketing Emails', desc: 'Receive news and updates from us'},
                ].map((pref, idx) => (
                  <div key={idx} className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div>
                      <p className='font-semibold text-gray-900'>{pref.label}</p>
                      <p className='text-sm text-gray-600 mt-1'>{pref.desc}</p>
                    </div>
                    <button className='px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm'>
                      ✓ Enabled
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Security Settings</h2>

              <div className='space-y-6'>
                {/* Change Password */}
                <div className='border border-gray-200 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 mb-3'>Change Password</h3>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Current Password</label>
                      <input type='password' className='w-full px-4 py-3 border border-gray-300 rounded-lg' placeholder='••••••••' />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>New Password</label>
                      <input type='password' className='w-full px-4 py-3 border border-gray-300 rounded-lg' placeholder='••••••••' />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Confirm Password</label>
                      <input type='password' className='w-full px-4 py-3 border border-gray-300 rounded-lg' placeholder='••••••••' />
                    </div>
                    <button
                      onClick={() => toast.success('✅ Password updated!')}
                      className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>Two-Factor Authentication</h3>
                      <p className='text-sm text-gray-600 mt-1'>Add an extra layer of security to your account</p>
                    </div>
                    <button className='px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold'>
                      Enable
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className='border border-gray-200 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 mb-3'>Active Sessions</h3>
                  <div className='space-y-2 text-sm text-gray-700'>
                    <p>💻 Chrome on Windows • Last active: Now</p>
                    <p>📱 Safari on iPhone • Last active: 2 hours ago</p>
                  </div>
                  <button className='w-full mt-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm'>
                    Sign Out All Other Sessions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
