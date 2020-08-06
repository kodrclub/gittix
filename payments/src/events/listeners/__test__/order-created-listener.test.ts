import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { OrderCreatedEvent, OrderStatus } from '@kc-gittix/common'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    expiresAt: 'oiuoui',
    status: OrderStatus.Created,
    ticket: {
      id: 'dasdasd',
      price: 10,
    },
    userId: 'lkjljk',
    version: 0,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, listener, msg }
}

it('replicates the order info', async () => {
  const { data, listener, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
