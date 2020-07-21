import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201))

it('returns a 400 with an invalid email', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtesttest',
      password: 'password',
    })
    .expect(400))

it('returns a 400 with an invalid password', async () =>
  request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'x',
    })
    .expect(400))

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password 1',
    })
    .expect(201)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password 2',
    })
    .expect(400)
})

it('sets a cookie after a successful signup', async () => {
  const response = await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  })

  expect(response.get('Set-Cookie')).toBeDefined()
})
