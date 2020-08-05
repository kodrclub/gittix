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
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('eur')

  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: chargeOptions!.id,
  // })
  // console.log(payment)
  // expect(payment).not.toBeNull()
})

//
//
//----------------------------------------------------------------------------------------------------------
//
//
// it('has a route handler listening at /api/tickets for post requests', async () => {
//   const response = await request(app).post('/api/tickets').send({})

//   expect(response.status).not.toEqual(404)
// })

// it('can only be accessed if the user is signed in', async () => {
//   const response = await request(app).post('/api/tickets').send({}).expect(401)
// })

// it('returns a status other than 401 if the user is signed in', async () => {
//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({})

//   expect(response.status).not.toEqual(401)
// })

// it('returns an error if an invalid title is provided', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       title: '',
//       price: 10,
//     })
//     .expect(400)

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       price: 10,
//     })
//     .expect(400)
// })

// it('returns an error if an invalid price is provided', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       title: 'A test title',
//       price: -10,
//     })
//     .expect(400)
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       title: 'A test title',
//     })
//     .expect(400)
// })

// it('creates a ticket with valid inputs', async () => {
//   let tickets = await Ticket.find({})
//   expect(tickets.length).toEqual(0)

//   const title = 'A test title'
//   const price = 10.5
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       title,
//       price,
//     })
//     .expect(201)

//   tickets = await Ticket.find({})
//   expect(tickets.length).toEqual(1)
//   expect(tickets[0].title).toEqual(title)
//   expect(tickets[0].price).toEqual(price)
// })

// it('publishes an event', async () => {
//   const title = 'A test title'
//   const price = 10.5
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.authenticate())
//     .send({
//       title,
//       price,
//     })
//     .expect(201)

//   expect(natsWrapper.client.publish).toHaveBeenCalled()
// })

// it('', async()=>{})
