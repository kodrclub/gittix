import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the ticket is not found', async () => {
  const id = global.generateId()

  const r = await request(app)
    .get(`/api/tickets/${id}`) //BEWARE!!! make sure to use a valid ObjectId. Just passing a random string as an id will result in a 500 error!
    .set('Cookie', global.authenticate())
    .send()
    .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'Some title'
  const price = 3.5

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({ title, price })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})

// it('', async () => {})
