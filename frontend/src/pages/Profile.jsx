import React, { useContext, useState, useEffect, useCallback } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {

  const { token, navigate, backendUrl } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [originalProfile, setOriginalProfile] = useState(null)

  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState(null)
  const [editingAddress, setEditingAddress] = useState(null)

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    newArrivals: true,
    exclusiveOffers: true,
    marketingEmails: false,
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
      if (response.data.success) {
        const user = response.data.user
        const profile = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        }
        setProfileData(profile)
        setOriginalProfile(profile)
        setAddresses(user.addresses || [])
        setPreferences(user.preferences || {
          orderUpdates: true,
          newArrivals: true,
          exclusiveOffers: true,
          marketingEmails: false,
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [backendUrl, token])

  useEffect(() => {
    if (token) {
      fetchProfile()
    }
  }, [token, fetchProfile])

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await axios.put(backendUrl + '/api/user/profile', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      }, { headers: { token } })

      if (response.data.success) {
        const user = response.data.user
        const profile = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        }
        setProfileData(profile)
        setOriginalProfile(profile)
        setEditMode(false)
        toast.success('Profile updated!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return toast.error('All password fields are required')
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (passwords.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters')
    }

    try {
      setSaving(true)
      const response = await axios.put(backendUrl + '/api/user/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Password updated successfully!')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  // Add address
  const handleAddAddress = async () => {
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.street || !newAddress.city || !newAddress.country) {
      return toast.error('Please fill in all required fields')
    }

    try {
      setSaving(true)
      const response = await axios.post(backendUrl + '/api/user/address', {
        ...newAddress,
      }, { headers: { token } })

      if (response.data.success) {
        setAddresses(response.data.addresses)
        setNewAddress(null)
        toast.success('Address added!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to add address')
    } finally {
      setSaving(false)
    }
  }

  // Update address
  const handleUpdateAddress = async () => {
    try {
      setSaving(true)
      const response = await axios.put(backendUrl + '/api/user/address', {
        addressId: editingAddress._id,
        ...editingAddress,
      }, { headers: { token } })

      if (response.data.success) {
        setAddresses(response.data.addresses)
        setEditingAddress(null)
        toast.success('Address updated!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to update address')
    } finally {
      setSaving(false)
    }
  }

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(backendUrl + '/api/user/address', {
        headers: { token },
        data: { addressId }
      })

      if (response.data.success) {
        setAddresses(response.data.addresses)
        toast.success('Address deleted!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }

  // Update preferences
  const handleTogglePreference = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] }
    setPreferences(updated)

    try {
      const response = await axios.put(backendUrl + '/api/user/preferences', {
        preferences: updated,
      }, { headers: { token } })

      if (!response.data.success) {
        // Revert on failure
        setPreferences(preferences)
        toast.error(response.data.message)
      }
    } catch (error) {
      setPreferences(preferences)
      toast.error('Failed to update preferences')
    }
  }

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

      {loading ? (
        <div className='flex items-center justify-center min-h-[40vh]'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3'></div>
            <p className='text-gray-600'>Loading profile...</p>
          </div>
        </div>
      ) : (
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
                  onClick={() => {
                    if (editMode) {
                      setProfileData(originalProfile)
                    }
                    setEditMode(!editMode)
                  }}
                  className='px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold'
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {/* Avatar */}
              <div className='mb-8 text-center'>
                <div className='w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3'>
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : '?'}
                </div>
                <p className='text-gray-600 text-sm'>{profileData.name || 'Your Account'}</p>
              </div>

              {/* Profile Fields */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name</label>
                  <input
                    disabled={!editMode}
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                    type="text"
                    placeholder='Kamal Perera'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
                  <input
                    disabled={!editMode}
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-blue-400 focus:outline-none' : 'border-gray-300 bg-gray-50'}`}
                    type="email"
                    placeholder='kamal@gmail.com'
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
                    placeholder='+94 77 123 4567'
                  />
                </div>
              </div>

              {editMode && (
                <div className='mt-6 flex gap-3'>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className='flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50'
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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
                    type: 'Home',
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
              {addresses.length === 0 && !newAddress && (
                <p className='text-gray-500 text-center py-8'>No addresses saved yet. Add your first address.</p>
              )}

              <div className='space-y-4 mb-6'>
                {addresses.map(addr => (
                  <div key={addr._id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
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
                      <div className='flex gap-3'>
                        <button
                          onClick={() => setEditingAddress({...addr})}
                          className='text-blue-600 text-sm font-semibold hover:text-blue-700'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className='text-red-600 text-sm font-semibold hover:text-red-700'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className='text-gray-900 font-semibold'>{addr.firstName} {addr.lastName}</p>
                    <p className='text-gray-700'>{addr.street}</p>
                    <p className='text-gray-700'>{addr.city}, {addr.state} {addr.zipcode}</p>
                    <p className='text-gray-700'>{addr.country}</p>
                  </div>
                ))}
              </div>

              {/* Edit Address Form */}
              {editingAddress && (
                <div className='border-t border-gray-200 pt-6'>
                  <h3 className='font-semibold text-gray-900 mb-4'>Edit Address</h3>
                  <div className='space-y-3'>
                    <input
                      placeholder='Address Type (e.g., Home, Office)'
                      value={editingAddress.type}
                      onChange={(e) => setEditingAddress({...editingAddress, type: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='Kamal'
                        value={editingAddress.firstName}
                        onChange={(e) => setEditingAddress({...editingAddress, firstName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Perera'
                        value={editingAddress.lastName}
                        onChange={(e) => setEditingAddress({...editingAddress, lastName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <input
                      placeholder='42 Galle Road'
                      value={editingAddress.street}
                      onChange={(e) => setEditingAddress({...editingAddress, street: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='Colombo'
                        value={editingAddress.city}
                        onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Western'
                        value={editingAddress.state}
                        onChange={(e) => setEditingAddress({...editingAddress, state: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='10100'
                        value={editingAddress.zipcode}
                        onChange={(e) => setEditingAddress({...editingAddress, zipcode: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Sri Lanka'
                        value={editingAddress.country}
                        onChange={(e) => setEditingAddress({...editingAddress, country: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={editingAddress.isDefault}
                        onChange={(e) => setEditingAddress({...editingAddress, isDefault: e.target.checked})}
                        className='w-4 h-4'
                      />
                      <label className='text-sm text-gray-700'>Set as default address</label>
                    </div>
                    <div className='flex gap-3'>
                      <button
                        onClick={handleUpdateAddress}
                        disabled={saving}
                        className='flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50'
                      >
                        {saving ? 'Saving...' : 'Update Address'}
                      </button>
                      <button
                        onClick={() => setEditingAddress(null)}
                        className='flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {newAddress && (
                <div className='border-t border-gray-200 pt-6'>
                  <h3 className='font-semibold text-gray-900 mb-4'>Add New Address</h3>
                  <div className='space-y-3'>
                    <input
                      placeholder='Address Type (e.g., Home, Office)'
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='Kamal'
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Perera'
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <input
                      placeholder='42 Galle Road'
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='Colombo'
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Western'
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <input
                        placeholder='10100'
                        value={newAddress.zipcode}
                        onChange={(e) => setNewAddress({...newAddress, zipcode: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                      <input
                        placeholder='Sri Lanka'
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        className='px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className='w-4 h-4'
                      />
                      <label className='text-sm text-gray-700'>Set as default address</label>
                    </div>
                    <div className='flex gap-3'>
                      <button
                        onClick={handleAddAddress}
                        disabled={saving}
                        className='flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50'
                      >
                        {saving ? 'Saving...' : 'Save Address'}
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
                  {key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes'},
                  {key: 'newArrivals', label: 'New Arrivals', desc: 'Be the first to know about new products'},
                  {key: 'exclusiveOffers', label: 'Exclusive Offers', desc: 'Receive exclusive discounts and promotions'},
                  {key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive news and updates from us'},
                ].map((pref) => (
                  <div key={pref.key} className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div>
                      <p className='font-semibold text-gray-900'>{pref.label}</p>
                      <p className='text-sm text-gray-600 mt-1'>{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference(pref.key)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold text-sm transition-colors ${
                        preferences[pref.key]
                          ? 'border-green-600 text-green-600 hover:bg-green-50'
                          : 'border-gray-400 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {preferences[pref.key] ? '✓ Enabled' : '✗ Disabled'}
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
                      <input
                        type='password'
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                        placeholder='Enter current password'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>New Password</label>
                      <input
                        type='password'
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                        placeholder='At least 8 characters'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Confirm New Password</label>
                      <input
                        type='password'
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg'
                        placeholder='Re-enter new password'
                      />
                    </div>
                    {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                      <p className='text-red-500 text-sm'>Passwords do not match</p>
                    )}
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50'
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

export default Profile
