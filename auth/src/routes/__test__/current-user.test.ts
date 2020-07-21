import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
  const cookie = await global.authenticate()

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  // console.log(response.body)
  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with undefined if not signed in', async () => {
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200)

  // console.log(response.body)
  expect(response.body.currentUser).toBeUndefined()
})
