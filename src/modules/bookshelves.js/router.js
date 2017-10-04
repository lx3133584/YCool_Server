import { ensureUser } from '../../middleware/validators'
import * as bookshelf from './controller'

export const baseUrl = '/bookshelf'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      bookshelf.getBookshelf
    ]
  },
  {
    method: 'POST',
    route: '/order',
    handlers: [
      ensureUser,
      bookshelf.orderNovel
    ]
  },
  {
    method: 'POST',
    route: '/delete',
    handlers: [
      bookshelf.deleteNovel
    ]
  },
  {
    method: 'POST',
    route: '/change',
    handlers: [
      ensureUser,
      bookshelf.changeBookshelf
    ]
  }
]
