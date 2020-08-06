import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
// import { Payment } from '../../models/payment'
// import { natsWrapper } from '../../nats-wrapper'
import { OrderStatus } from '@kc-gittix/common'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns a 404 when trying to purchase an order that does not exist', async () => {
  //
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.authenticate())
    .send({
      token: 'dasdasd',
      orderId: global.generateId(),
    })
    .expect(404)
})

it('returns a 401 when trying to purchase an order that does not belong to the user', async () => {
  const order = Order.build({
    id: global.generateId(),
    price: 20,
    status: OrderStatus.Created,
    userId: global.generateId(),
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.authenticate())
    .send({
      token: 'dasdasd',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 when trying to purchase a cancelled order ', async () => {
  const userId = global.generateId()

  const order = Order.build({
    id: global.generateId(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.authenticate(userId))
    .send({
      token: 'dasdasd',
      orderId: order.id,
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = global.generateId()
  const order = Order.build({
    id: global.generateId(),
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.authenticate(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('eur')
})
