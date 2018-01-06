'use strict'

const Model = require('./model')

const internals = {}

module.exports = function (options) {
  internals.Contact = Model(options)

  return {
    create,
    listAll,
    read
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
