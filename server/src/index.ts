import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './Routers/api.js'
import './db.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
