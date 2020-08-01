import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'

const generateId = () => {
  return mongoose.Types.ObjectId().toHexString()
}

it.todo('returns a 404 if the order does not exist')
/*
  it.('returns a 404 if the order does not exist', async () => {
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
*/

it.todo('returns a 401 if the user is not authenticated')
/*
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
*/

it.todo('returns a 401 if the user does not own the order')
/*
  it('returns a 401 if the user does not own the order', async () => {
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
*/

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'Some title',
    price: 50,
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

  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  const fetchedOrder = await Order.findById(order.id)
  expect(fetchedOrder!.status).toEqual(OrderStatus.Cancelled)
})

// it.todo('publishes an event')
it('publishes an event', async () => {
  const ticket = Ticket.build({
    title: 'Some title',
    price: 50,
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

  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
