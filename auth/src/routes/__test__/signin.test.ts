import request from 'supertest'
import { app } from '../../app'

it('returns a 400 when attempting signin with an email that doesnt exist', async () =>
  request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400))

it('returns a 400 when attempting signin with an incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password 1',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password 2',
    })
    .expect(400)
})

it('responds with a cookie when the signin is successful', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
