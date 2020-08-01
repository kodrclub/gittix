import request from 'supertest'
import { app } from '../../app'

it('can fetch a list of tickets', async () => {
  const title = 'Some title'
  const price = 3.5

  const createTicket = () => {
    return request(app)
      .post('/api/tickets')
      .set('Cookie', global.authenticate())
      .send({
        title: 'dasdasda',
        price: 11.1,
      })
  }

  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app).get('/api/tickets').expect(200)
  expect(response.body.length).toEqual(3)
})

// it('', async () => {})
