import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, currentUser, NotFoundError } from '@kc-gittix/common'

import { deleteOrderRouter } from './routes/delete'
import { indexOrderRouter } from './routes/index'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'

const app = express()
app.set('trust proxy', true)

// initial uses
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != 'test',
  })
)
app.use(currentUser)
app.use(errorHandler)

// route uses
app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

// catchall endpoint
app.all('*', async () => {
  throw new NotFoundError()
})

export { app }
