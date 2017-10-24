import { ensureUser } from '../../middleware/validators'
import upload from '../../middleware/upload'
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
    route: '/modify_password',
    handlers: [
      ensureUser,
      user.modifyPassword
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
    method: 'POST',
    route: '/avatar',
    handlers: [
      ensureUser,
      upload.single('avatar'),
      user.modifyAvatar
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
