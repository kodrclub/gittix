import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { OrderCancelledEvent, OrderStatus } from '@kc-gittix/common'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: global.generateId(),
    price: 10,
    status: OrderStatus.Created,
    userId: 'dasda',
    version: 0,
  })
  await order.save()

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {
      id: 'dasdada',
    },
    version: 1,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { data, listener, msg, order }
}

it('updates the status of the order', async () => {
  const { data, listener, msg, order } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // assert that a order was cancelled
  const updatedOrder = await Order.findById(data.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { data, listener, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
