import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      authenticate(): string[]
    }
  }
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'whatever'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

//
//-------------------------------------------
//

global.authenticate = () => {
  //build JWT payload {id, email}
  const payload = {
    id: 'adiuayiddasdaf',
    email: 'test@test.com',
  }

  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  //build session Object {jwt: MY_JWT}
  const session = { jwt: token }

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  //encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  console.log(base64)
  //return a string consisting of the cookie with the encoded data
  return [`express:sess=${base64}`]
}

// global.authenticate = async () => {
//   const email = 'test@test.com'
//   const password = 'password'

//   const response = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email,
//       password,
//     })
//     .expect(201)

//   const cookie = response.get('Set-Cookie')
//   return cookie
// }
