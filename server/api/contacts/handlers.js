'use strict'

const Model = require('./model')

const internals = {}

module.exports = function (options) {
  internals.Contact = Model(options)

  return {
    create,
    listAll,
    read,
    remove
  }
}

function create (request, h) {
  return internals.Contact.create(request.payload)
}

function listAll (request, h) {
  return internals.Contact.listAll()
}

function read (request, h) {
  const { id } = request.params

  return internals.Contact.read(id)
}

async function remove (request, h) {
  const { id } = request.params

  await internals.Contact.remove(id)

  return h.response().code(204)
}
