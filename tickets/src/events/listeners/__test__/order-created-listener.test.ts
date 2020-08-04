import { Message } from 'node-nats-streaming'
// import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@kc-gittix/common'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asd',
  })
  await ticket.save()

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    expiresAt: 'oiuoui',
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: 'lkjljk',
    version: 0,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, listener, msg, ticket }
}

it('sets the userId of the ticket', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // assert that a order was created
  const updatedTicket = await Ticket.findById(data.ticket.id)
  expect(updatedTicket).toBeDefined()
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
