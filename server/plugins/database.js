'use strict'

module.exports = {
  name: 'DatabasePlugin',

  register: (server, options) => {
    const knex = require('knex')(options)

    server.app.knex = knex
  }
}
