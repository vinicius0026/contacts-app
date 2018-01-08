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
        tags: ['api'],
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
        tags: ['api'],
        description: 'Reads a specific contact by id',
        validate: {
          params: {
            id: Joi.number().integer().min(1).required()
          }
        },
        handler: internals.handlers.read
      }
    },
    {
      method: 'DELETE',
      path: `${internals.basePath}/{id}`,
      config: {
        tags: ['api'],
        description: 'Deletes a specific contact by id',
        validate: {
          params: {
            id: Joi.number().integer().min(1).required()
          }
        },
        handler: internals.handlers.remove
      }
    },
    {
      method: 'PUT',
      path: `${internals.basePath}/{id}`,
      config: {
        tags: ['api'],
        description: 'Updates a contact by id, the previous contact is replaced by the request payload',
        validate: {
          payload: Schema.update,
          params: {
            id: Joi.number().integer().min(1).required()
          }
        },
        handler: internals.handlers.update
      }
    }
  ])
}
