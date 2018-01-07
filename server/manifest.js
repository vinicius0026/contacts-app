const Boom = require('boom')
const Path = require('path')

const Config = require('./config')

module.exports = {
  server: {
    port: Config.get('/server/port'),
    host: Config.get('/server/host'),
    routes: {
      files: {
        relativeTo: Path.resolve(__dirname, '..')
      },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            console.error('ValidationError:', err.message)
            throw Boom.badRequest(`Invalid request payload input`)
          } else {
            console.error(err)
            throw err
          }
        }
      }
    }
  },
  register: {
    plugins: [
      ...Config.get('/plugins'),
      '../api/contacts',
      { plugin: './database', options: Config.get('/db') }
    ]
  }
}
