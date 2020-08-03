import { Ticket } from '../ticket'
import { isMainThread } from 'worker_threads'
import { isatty } from 'tty'

it('implements optimistic concurrency control', async (done) => {
  //create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  //save ticket
  await ticket.save()

  //fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  //make one separate change to each copy of the ticket
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 20 })

  //save first fetched ticket
  await firstInstance!.save()

  //save second fetched ticket and expect an error
  try {
    await secondInstance!.save()
  } catch (error) {
    return done()
  }

  throw new Error('Failed to implement optimistic concurrency control')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
