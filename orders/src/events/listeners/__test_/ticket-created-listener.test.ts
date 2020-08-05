import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { TicketCreatedEvent } from '@kc-gittix/common'
import { TicketCreatedListener } from '../ticket-created-listener'

const setup = async () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: global.generateId(),
    title: 'concert',
    price: 10,
    userId: global.generateId(),
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // assert that a ticket was created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // asert that the ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
