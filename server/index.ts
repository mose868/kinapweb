import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from '../client/src/api'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// API routes
app.use('/api', apiRoutes)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!'
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 