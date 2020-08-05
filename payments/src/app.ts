import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, currentUser, NotFoundError } from '@kc-gittix/common'

// import { indexTicketRouter } from './routes/index'
// import { newTicketRouter } from './routes/new'
// import { showTicketRouter } from './routes/show'
// import { updateTicketRouter } from './routes/update'

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
// app.use(indexTicketRouter)
// app.use(newTicketRouter)
// app.use(showTicketRouter)
// app.use(updateTicketRouter)

// catchall endpoint
app.all('*', async () => {
  throw new NotFoundError()
})

export { app }
