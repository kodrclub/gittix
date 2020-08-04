import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'

const generateId = () => {
  return global.generateId()
}

it('has a route handler listening at /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({}).expect(401)
})

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.authenticate())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('returns a 404 error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId() //.toHexString()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.authenticate())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Test title',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'dasdasd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.authenticate())
    .send({
      ticketId: ticket.id,
    })
    .expect(400)
})

it('creates a order with valid inputs', async () => {
  const ticket = Ticket.build({
    title: 'Test title',
    price: 20,
  })
  await ticket.save()

  expect((await Order.find()).length).toEqual(0)

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.authenticate())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  expect((await Order.find()).length).toEqual(1)
})

// it.todo('publishes an event')
it('publishes an event', async () => {
  const ticket = Ticket.build({
    title: 'Test title',
    price: 20,
  })
  await ticket.save()

  expect((await Order.find()).length).toEqual(0)

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.authenticate())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

// it('', async()=>{})
