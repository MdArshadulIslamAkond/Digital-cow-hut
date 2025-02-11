import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import router from './app/routes'
import cookieParser from 'cookie-parser'
const app: Application = express()
app.use(cors())

//parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// //Testing
// app.get('/', (req: Request, res: Response) => {
//   res.send('Working successfully')
// })
app.use('/api/v1', router)
app.use(globalErrorHandler)
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  // if (!res.headersSent) {
  //   next()
  // }
})
export default app
