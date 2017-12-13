import * as test from './controller'

export const baseUrl = '/test'

export default [
  {
    method: 'POST',
    route: '/update_vip',
    handlers: [
      test.updateVip
    ]
  },
  {
    method: 'POST',
    route: '/update_rank',
    handlers: [
      test.updateRank
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
