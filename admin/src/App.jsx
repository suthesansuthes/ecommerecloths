import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import Edit from './pages/Edit'
import List from './pages/List'
import Orders from './pages/Orders'
import FilterOptions from './pages/FilterOptions'
import Newsletter from './pages/Newsletter'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <div className='flex h-[calc(100vh-64px)]'>
            {/* Sidebar - Hidden on mobile, visible on md+ */}
            <div className={`
              fixed md:static inset-0 z-40 md:z-0
              w-64 overflow-y-auto bg-white border-r border-gray-200
              transition-all duration-300
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
              <Sidebar />
            </div>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                onClick={() => setSidebarOpen(false)}
                className='fixed inset-0 md:hidden bg-black/30 z-30'
              />
            )}
            
            {/* Main Content */}
            <div className='flex-1 overflow-y-auto'>
              <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
                <Routes>
                  <Route path='/' element={<List token={token} />} />
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/edit/:productId' element={<Edit token={token} />} />
                  <Route path='/list' element={<List token={token} />} />
                  <Route path='/orders' element={<Orders token={token} />} />
                  <Route path='/filter-options' element={<FilterOptions token={token} />} />
                  <Route path='/newsletter' element={<Newsletter token={token} />} />
                </Routes>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App