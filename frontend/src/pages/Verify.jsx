import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {

            if (!token) {
                toast.error('Authentication required. Please login.')
                navigate('/login')
                return
            }

            // Only verify if success is true (payment completed)
            if (success === 'true') {
                const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })

                if (response.data.success) {
                    setCartItems({})
                    toast.success('Payment verified! Order placed successfully.')
                    navigate('/orders')
                } else {
                    toast.error('Payment verification failed')
                    navigate('/cart')
                }
            } else {
                // Payment was cancelled
                toast.error('Payment cancelled. Please try again.')
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Verification failed')
            navigate('/cart')
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token])

    return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
                <p className='text-gray-600'>Verifying payment...</p>
            </div>
        </div>
    )
}

export default Verify