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
    method: 'POST',
    route: '/edit_name',
    handlers: [
      ensureUser,
      user.editName
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
