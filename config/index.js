import common from './env/common';
const env = process.env.NODE_ENV || 'production';
let config
if (env === 'production') {
  config = require(`./env/production`).default;
} else {
  config = require(`./env/development`).default;
}

export default Object.assign({}, common, config)
