import { Message } from 'node-nats-streaming'
// import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCancelledEvent, OrderStatus } from '@kc-gittix/common'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asdf',
  })
  const orderId = global.generateId()
  ticket.set({ orderId })
  await ticket.save()

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, listener, msg, orderId, ticket }
}

it('updates the ticket', async () => {
  const { data, listener, msg, ticket } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // assert that a order was cancelled
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket).toBeDefined()
  expect(updatedTicket!.orderId).not.toBeDefined()
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, data, msg, orderId } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
