import { ensureUser } from '../../middleware/validators'
import * as user from './controller'

export const baseUrl = '/user'

export default [
  {
    method: 'POST',
    route: '/tourists',
    handlers: [
      user.createTourist
    ]
  },
  {
    method: 'POST',
    route: '/register',
    handlers: [
      user.createUser
    ]
  },
  {
    method: 'POST',
    route: '/login',
    handlers: [
      user.loginUser
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      user.getInfo
    ]
  },
]
