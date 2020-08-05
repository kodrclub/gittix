import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@kc-gittix/common'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
// import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })
    await order.save()

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
