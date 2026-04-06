import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [errors, setErrors] = useState({})
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!token) {
            toast.info('📝 Please login to place an order')
            // Store the redirect path so user returns here after login
            localStorage.setItem('redirectAfterLogin', '/place-order')
            navigate('/login')
        }
    }, [token, navigate])
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        if (!formData.street.trim()) newErrors.street = 'Street is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required'
        if (!formData.country.trim()) newErrors.country = 'Country is required'
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        
        if (!validateForm()) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {

                // API Calls for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}})
                    if (response.data.success) {
                        setCartItems({})
                        toast.success('✅ Order placed successfully!')
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}})
                    if (responseStripe.data.success) {
                        const {session_url} = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'payhere':
                    const responsePayhere = await axios.post(backendUrl + '/api/order/payhere', orderData, {headers: {token}})
                    if (responsePayhere.data.success) {
                        window.location.replace(responsePayhere.data.paymentUrl)
                    } else {
                        toast.error(responsePayhere.data.message)
                    }
                    break;

                default:
                    break;
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const paymentMethods = [
        {id: 'stripe', name: 'Stripe', icon: assets.stripe_logo, desc: 'Secure card payment'},
        {id: 'payhere', name: 'PayHere', icon: assets.payhere, desc: 'Card & Digital payment'},
        {id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive'}
    ]

    return (
        <form onSubmit={onSubmitHandler} className='py-8'>
            {/* Step Indicator */}
            <div className='max-w-4xl mx-auto mb-12'>
                <div className='flex justify-between mb-8'>
                    {['Address', 'Review', 'Payment'].map((label, idx) => (
                        <div key={idx} className='flex items-center flex-1'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                step > idx
                                    ? 'bg-green-600 text-white'
                                    : step === idx + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}>
                                {step > idx ? '✓' : idx + 1}
                            </div>
                            <p className={`ml-2 font-semibold ${step >= idx + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                                {label}
                            </p>
                            {idx < 2 && <div className={`flex-1 h-1 mx-2 rounded ${step > idx + 1 ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                
                {/* Left Side - Address Form */}
                {step === 1 && (
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg p-6 border border-gray-200'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Delivery Address</h2>

                            {/* Full Name */}
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>First Name *</label>
                                    <input
                                        required
                                        onChange={onChangeHandler}
                                        name='firstName'
                                        value={formData.firstName}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                            errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        type="text"
                                        placeholder='John'
                                    />
                                    {errors.firstName && <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Last Name *</label>
                                    <input
                                        required
                                        onChange={onChangeHandler}
                                        name='lastName'
                                        value={formData.lastName}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                            errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        type="text"
                                        placeholder='Doe'
                                    />
                                    {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className='mb-4'>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address *</label>
                                <input
                                    required
                                    onChange={onChangeHandler}
                                    name='email'
                                    value={formData.email}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                        errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    type="email"
                                    placeholder='john@example.com'
                                />
                                {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                            </div>

                            {/* Street */}
                            <div className='mb-4'>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Street Address *</label>
                                <input
                                    required
                                    onChange={onChangeHandler}
                                    name='street'
                                    value={formData.street}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                        errors.street ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    type="text"
                                    placeholder='123 Main Street'
                                />
                                {errors.street && <p className='text-red-500 text-xs mt-1'>{errors.street}</p>}
                            </div>

                            {/* City & State */}
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>City *</label>
                                    <input
                                        required
                                        onChange={onChangeHandler}
                                        name='city'
                                        value={formData.city}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                            errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        type="text"
                                        placeholder='Mumbai'
                                    />
                                    {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>State</label>
                                    <input
                                        onChange={onChangeHandler}
                                        name='state'
                                        value={formData.state}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                        type="text"
                                        placeholder='Maharashtra'
                                    />
                                </div>
                            </div>

                            {/* Zip & Country */}
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Zip Code *</label>
                                    <input
                                        required
                                        onChange={onChangeHandler}
                                        name='zipcode'
                                        value={formData.zipcode}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                            errors.zipcode ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        type="number"
                                        placeholder='400001'
                                    />
                                    {errors.zipcode && <p className='text-red-500 text-xs mt-1'>{errors.zipcode}</p>}
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Country *</label>
                                    <input
                                        required
                                        onChange={onChangeHandler}
                                        name='country'
                                        value={formData.country}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                            errors.country ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        type="text"
                                        placeholder='India'
                                    />
                                    {errors.country && <p className='text-red-500 text-xs mt-1'>{errors.country}</p>}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className='mb-6'>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Phone Number *</label>
                                <input
                                    required
                                    onChange={onChangeHandler}
                                    name='phone'
                                    value={formData.phone}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                        errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    type="tel"
                                    placeholder='+91 98765 43210'
                                />
                                {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
                            </div>

                            <button
                                type='button'
                                onClick={() => {
                                    if (validateForm()) setStep(2)
                                }}
                                className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
                            >
                                Continue to Review
                            </button>
                        </div>
                    </div>
                )}

                {/* Review Step */}
                {step === 2 && (
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg p-6 border border-gray-200'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Review Your Order</h2>

                            {/* Shipping Address */}
                            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Shipping Address</h3>
                                <p className='text-gray-700'>{formData.firstName} {formData.lastName}</p>
                                <p className='text-gray-700'>{formData.street}</p>
                                <p className='text-gray-700'>{formData.city}, {formData.state} {formData.zipcode}</p>
                                <p className='text-gray-700'>{formData.country}</p>
                                <p className='text-gray-700 mt-2'>{formData.phone}</p>
                                <button
                                    type='button'
                                    onClick={() => setStep(1)}
                                    className='text-blue-600 text-sm font-semibold mt-3 hover:text-blue-700'
                                >
                                    Edit Address
                                </button>
                            </div>

                            {/* Order Items */}
                            <div className='mb-6'>
                                <h3 className='font-semibold text-gray-900 mb-3'>Order Items</h3>
                                <div className='space-y-3 max-h-64 overflow-y-auto'>
                                    {/* Items will be displayed from order data */}
                                </div>
                            </div>

                            <button
                                type='button'
                                onClick={() => setStep(3)}
                                className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Step */}
                {step === 3 && (
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg p-6 border border-gray-200'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Select Payment Method</h2>

                            <div className='space-y-3 mb-6'>
                                {paymentMethods.map(pm => (
                                    <div
                                        key={pm.id}
                                        onClick={() => setMethod(pm.id)}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            method === pm.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-300 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className='flex items-center gap-4'>
                                            <div className={`w-6 h-6 rounded-full border-2 ${method === pm.id ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}></div>
                                            <div className='flex-1'>
                                                <p className='font-semibold text-gray-900'>{pm.name}</p>
                                                <p className='text-sm text-gray-600'>{pm.desc}</p>
                                            </div>
                                            {typeof pm.icon === 'string' && !pm.icon.includes('/') && !pm.icon.includes('.') ? (
                                                <span className='text-2xl'>{pm.icon}</span>
                                            ) : (
                                                <img src={pm.icon} alt={pm.name} className='h-8' />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type='button'
                                onClick={() => setStep(2)}
                                className='w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors mb-3'
                            >
                                Back to Review
                            </button>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <>
                                        <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' opacity='0.3'></circle>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Right Side - Order Summary */}
                <div className='lg:col-span-1'>
                    <div className='sticky top-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200'>
                        <h3 className='text-lg font-bold text-gray-900 mb-4'>Order Summary</h3>
                        <CartTotal />
                        
                        {/* Security Badges */}
                        <div className='mt-6 pt-6 border-t border-gray-300 space-y-2 text-sm text-gray-700'>
                            <p className='flex items-center gap-2'>
                                <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                                </svg>
                                Secure Checkout
                            </p>
                            <p className='flex items-center gap-2'>
                                <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                                </svg>
                                SSL Encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
