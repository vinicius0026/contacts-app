const Confidence = require('confidence')
const Dotenv = require('dotenv')
const Path = require('path')

Dotenv.config({ path: Path.resolve(__dirname, './.env') })

const internals = {}

const criteria = {
  env: process.env.NODE_ENV
}

const port = process.env.PORT || '8080'

const config = {
  $meta: 'Environment based config',
  server: {
    host: 'localhost',
    port,
    baseUrl: `http://localhost:${port}/`
  },
  plugins: {
    $filter: 'env',
    development: ['./devServer', './eventBus', 'inert', './appServer', './staticServer', './renderer'],
    $default: ['inert', './appServer', './staticServer', './renderer']
  },
  db: {
    client: 'pg',
    connection: {
      $filter: 'env',
      test: {
        database: 'contacts_app_test'
      },
      development: {
        database: 'contacts_app_dev'
      },
      production: process.env.DATABASE_URL
    }
  }
}

internals.store = new Confidence.Store(config)

exports.get = key => internals.store.get(key, criteria)
