import { Message } from 'node-nats-streaming'
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@kc-gittix/common'
import { natsWrapper } from '../../nats-wrapper'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'
import { version } from 'os'

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete

  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    })

    msg.ack()
  }
}
