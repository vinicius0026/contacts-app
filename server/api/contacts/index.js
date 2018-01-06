'use strict'

const Joi = require('joi')

const Schema = require('./schema')
const Handlers = require('./handlers')

const internals = {}

internals.basePath = '/api/contacts'

module.exports = {
  name: 'ContactsPlugin',

  register: (server, options, next) => {
    internals.options = options

    server.dependency(['DatabasePlugin'], internals.registerRoutes)
  }
}

internals.registerRoutes = async function (server) {
  internals.options.knex = server.app.knex
  internals.handlers = Handlers(internals.options)

  server.route([
    {
      method: 'POST',
      path: internals.basePath,
      config: {
        description: 'Creates a contact',
        validate: {
          payload: Schema.create
        },
        handler: internals.handlers.create
      }
    },
    {
      method: 'GET',
      path: internals.basePath,
      config: {
        description: 'Lists all contacts',
        handler: internals.handlers.listAll
      }
    },
    {
      method: 'GET',
      path: `${internals.basePath}/{id}`,
      config: {
        description: 'Reads a specific contact by id',
        validate: {
          params: {
            id: Joi.number().min(1)
          }
        },
        handler: internals.handlers.read
      }
    }
  ])
}
