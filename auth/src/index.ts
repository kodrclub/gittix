import { app } from './app'
import mongoose from 'mongoose'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('>>> auth connected to MongoDB')
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('>>> auth listening on port 3000')
  })
}

start()
