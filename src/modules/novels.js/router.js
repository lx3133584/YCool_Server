import { ensureUser, ensureUserNotCatch } from '../../middleware/validators'
import * as novel from './controller'

export const baseUrl = '/novels'

export default [
  {
    method: 'GET',
    route: '/rank',
    handlers: [
      novel.getRank
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      novel.downloadChapters
    ]
  },
  {
    method: 'GET',
    route: '/search/zh',
    handlers: [
      novel.searchFromZH
    ]
  },
  {
    method: 'GET',
    route: '/search/bqk',
    handlers: [
      novel.searchFromBQK
    ]
  },
  {
    method: 'POST',
    route: '/search',
    handlers: [
      novel.searchNovel
    ]
  },
  {
    method: 'POST',
    route: '/acquire',
    handlers: [
      ensureUserNotCatch,
      novel.getNovel
    ]
  },
  {
    method: 'GET',
    route: '/directory/:id',
    handlers: [
      novel.getDirectory
    ]
  },
]
