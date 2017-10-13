import * as test from './controller'

export const baseUrl = '/test'

export default [
  {
    method: 'GET',
    route: '/update',
    handlers: [
      test.updateNovel
    ]
  },
  {
    method: 'GET',
    route: '/img',
    handlers: [
      test.getImgs
    ]
  },
]
