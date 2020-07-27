import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, NotFoundError } from '@kodrclub-tickets/common'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

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
app.use(errorHandler)

// route uses
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// catchall endpoint
app.all('*', async () => {
  throw new NotFoundError()
})

export { app }
