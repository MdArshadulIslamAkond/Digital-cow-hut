import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const app: Application = express()
app.use(cors())

//parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Working successfully')
})

export default app
