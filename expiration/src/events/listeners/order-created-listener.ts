import { expirationQueue } from '../../queues/expiration-queue'
import { Listener, OrderCreatedEvent, Subjects } from '@kc-gittix/common'
import { Message } from 'node-nats-streaming'
// import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
// import { Ticket } from '../../models/ticket'
// import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    )

    msg.ack()
  }
}
