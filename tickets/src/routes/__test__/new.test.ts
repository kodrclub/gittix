import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening at /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({})

  expect(response.status).not.toEqual(401)
})
/*
it('returns an error if an invalid title is provided', async () => {
  request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({
      price: 10,
    })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({
      title: 'A test title',
      price: -10,
    })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.authenticate())
    .send({
      title: 'A test title',
    })
    .expect(400)
})
*/
it('creates a ticket with valid inputs', async () => {})

// it('', async()=>{})
