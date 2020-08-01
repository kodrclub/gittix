import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

it('returns a 404 if the order is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString()

  const r = await request(app)
    .get(`/api/orders/${id}`) //BEWARE!!! make sure to use a valid ObjectId. Just passing a random string as an id will result in a 500 error!
    .set('Cookie', global.authenticate())
    .send()
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const title = 'Some title'
  const price = 3.5
  const ticket = Ticket.build({
    title,
    price,
  })
  await ticket.save()

  const user = global.authenticate()

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  const orderResponse = await request(app)
    .get('/api/orders/')
    .send({ orderId: response.body.id })
    .expect(401)
})

it('returns a 401 if the user does not own the order', async () => {
  const title = 'Some title'
  const price = 3.5
  const ticket = Ticket.build({
    title,
    price,
  })
  await ticket.save()

  const user = global.authenticate()
  const otherUser = global.authenticate()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', otherUser)
    .send()
    .expect(401)
})

it('returns the order if the order is found', async () => {
  const title = 'Some title'
  const price = 3.5
  const ticket = Ticket.build({
    title,
    price,
  })
  await ticket.save()

  const user = global.authenticate()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ orderId: order.id })
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

// it('', async () => {})
