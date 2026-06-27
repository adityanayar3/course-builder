require('dotenv').config()        
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const courseRouter = require('./routes/courseRoutes')

const app = express()


app.use(cors())
app.use(express.json())


app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy')
})
app.use('/course', courseRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// connect DB
connectDB()