import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const generateId = () => {
  return mongoose.Types.ObjectId().toHexString()
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateId()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.authenticate())
    .send({
      title: 'dasdasda',
      price: 20,
    })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateId()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'dasdasda',
      price: 20,
    })
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const title = 'dasdasdaasd'
  const price = 20.2

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.authenticate())
    .send({
      title,
      price,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.authenticate())
    .send({
      title: 'xxxxxxxx',
      price: 300,
    })
    .expect(401)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.authenticate()

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'dasdasda',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20.2,
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'twyttrtwertw',
      price: 'opipoiypr',
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.authenticate()
  const title = 'a different valid title'
  const price = 30.3

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'dasdasda',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
