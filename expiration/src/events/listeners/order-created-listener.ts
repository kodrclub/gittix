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
    console.log('DDDDDDDDDDD - DELAY: ' + delay)

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    )
    // const ticket = await Ticket.findById(data.ticket.id)

    // if (!ticket) {
    //   throw new Error('Ticket not found')
    // }

    // ticket.set({ orderId: data.id })

    // await ticket.save()
    // new TicketUpdatedPublisher(this.client).publish({
    //   id: ticket.id,
    //   price: ticket.price,
    //   title: ticket.title,
    //   userId: ticket.userId,
    //   version: ticket.version,
    //   orderId: ticket.orderId,
    // })

    msg.ack()
  }
}
