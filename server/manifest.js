const Path = require('path')

const Config = require('./config')

module.exports = {
  server: {
    port: Config.get('/server/port'),
    host: Config.get('/server/host'),
    routes: {
      files: {
        relativeTo: Path.resolve(__dirname, '..')
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
