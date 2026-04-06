import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import filterRouter from './routes/filterRoute.js'
import newsletterRouter from './routes/newsletterRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

// Try to connect to database
try {
  connectDB()
  connectCloudinary()
} catch (error) {
  console.log('⚠️  Database connection failed - Running in MOCK MODE for testing UI')
}

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review',reviewRouter)
app.use('/api/filter',filterRouter)
app.use('/api/newsletter',newsletterRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

// Mock API for testing (when database is not available)
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Mock API Test - Running in UI Testing Mode',
    status: 'success',
    timestamp: new Date().toISOString()
  })
})

// Catch-all for unmatched routes - return mock data
app.use((req, res) => {
  res.status(200).json({ 
    message: 'Mock response - Database not connected',
    path: req.path,
    method: req.method,
    note: 'This is a test mode - configure MongoDB to enable full functionality'
  })
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))