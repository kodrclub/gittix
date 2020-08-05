import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, currentUser, NotFoundError } from '@kc-gittix/common'

// import { indexChargeRouter } from './routes/index'
import { newChargeRouter } from './routes/new'
// import { showChargeRouter } from './routes/show'
// import { updateChargeRouter } from './routes/update'

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
// app.use(indexChargeRouter)
app.use(newChargeRouter)
// app.use(showChargeRouter)
// app.use(updateChargeRouter)

// catchall endpoint
app.all('*', async () => {
  throw new NotFoundError()
})

export { app }
