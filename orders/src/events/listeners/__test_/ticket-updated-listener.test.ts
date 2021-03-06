import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedEvent } from '@kc-gittix/common'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  //create and save a ticket
  const ticket = Ticket.build({
    id: global.generateId(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: ticket.title + ' updated',
    price: ticket.price + 10,
    userId: 'xxxxxxxxxx',
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  // assert that a ticket was updated
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
