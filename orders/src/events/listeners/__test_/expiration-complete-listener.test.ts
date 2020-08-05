import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import { ExpirationCompleteEvent, OrderStatus } from '@kc-gittix/common'
import { ExpirationCompleteListener } from '../expiration-complete-listener'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: global.generateId(),
    title: 'concert',
    price: 10,
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'adfdghsdy',
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, listener, msg, order, ticket }
}

it('updates the order status to cancelled', async () => {
  const { data, listener, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.orderId)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an OrderCancelled event', async () => {
  const { data, listener, msg, order } = await setup()

  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(eventData.id).toEqual(order.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
