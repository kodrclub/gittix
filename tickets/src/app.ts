import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/new'
import {
  errorHandler,
  currentUser,
  NotFoundError,
} from '@kodrclub-tickets/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != 'test',
  })
)
app.use(createTicketRouter)
app.use(currentUser)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
