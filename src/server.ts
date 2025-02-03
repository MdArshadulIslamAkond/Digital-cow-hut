import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { errorlogger, logger } from './shared/logger'
import { Server } from 'http'

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  // console.log('Unhandled Exception detected..........')
  errorlogger.error(error)
  process.exit(1)
})
let server: Server | undefined
async function boostrap() {
  try {
    await mongoose.connect(config.datrabase_url as string)
    console.log('Connected to MongoDB successfully')
    server = app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`)
    })
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  }
  // Handle unhandled promise rejections
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorlogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

boostrap()
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, exiting gracefully')
  if (server) {
    server.close()
  }
})
