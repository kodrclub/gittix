import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCreatedEvent } from '@kc-gittix/common'
// import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: data.id })

    await ticket.save()
    // const { id, title, price } = data

    // const order = Order.build({
    //   id,
    //   title,
    //   price,
    // })
    // await order.save()

    msg.ack()
  }
}
