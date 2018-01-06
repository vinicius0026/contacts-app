'use strict'

const Model = require('./model')

const internals = {}

module.exports = function (options) {
  internals.Contact = Model(options)

  return {
    create,
    listAll
  }
}

async function create (request, h) {
  return internals.Contact.create(request.payload)
}

async function listAll (request, h) {
  return internals.Contact.listAll()
}
