'use strict'

const _ = require('lodash')
const Code = require('code')
const Lab = require('lab')
const Path = require('path')

const { describe, it, before, beforeEach, after, afterEach } = exports.lab = Lab.script()
const { expect } = Code

const dbConfig = require('../../../knexfile')
const Config = require('../../../server/config')
const Server = require('../../../server')

const Payload = require('../helpers/payload')

const knex = require('knex')(dbConfig)

const internals = {}

describe('Contacts API Tests', () => {
  before(async () => {
    await knex.migrate.latest()
  })

  after(async () => {
    await knex.migrate.rollback()
    await knex.destroy()
  })

  describe('Create Contact Tests', () => {
    after(async () => {
      await knex('addresses').del()
      await knex('contacts').del()
    })

    it('should create contact', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const contact = Payload.contact()

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })

      expect(res.statusCode).to.equal(201)
      const createdContact = res.result

      _.keys(_.omit(contact, ['addresses'])).forEach(prop => {
        expect(createdContact[prop]).to.equal(contact[prop])
      })

      contact.addresses.forEach(addr => {
        const createdAddress = createdContact.addresses.find(cAddr => cAddr.street === addr.street)
        expect(createdAddress).to.exist()
      })

      await server.stop()
    })

    it('validates input, failing with 400 if required info not sent', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const contact = Payload.contact()

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: _.omit(contact, ['firstName'])
      })

      expect(res.statusCode).to.equal(400)
      expect(res.result).to.equal({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request payload input'
      })

      await server.stop()
    })

    it('database error returns 500 without leaking any additional info or call stack', async () => {
      const server = await Server.init(internals.brokenManifest, internals.composeOptions)

      const contact = Payload.contact()

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })

      expect(res.statusCode).to.equal(500)
      expect(res.result).to.equal({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      })

      await server.stop()
    })
  })

  describe('List Contacts Test', () => {
    const numberOfContacts = 10
    before(async () => {
      const contacts = Array(numberOfContacts).fill(0).map(i => Payload.contact())

      const server = await Server.init(internals.manifest, internals.composeOptions)

      await Promise.all(contacts.map(contact => server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })))

      await server.stop()
    })

    after(async () => {
      await knex('addresses').del()
      await knex('contacts').del()
    })

    it('should list all contacts, returnin only ids and full names', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'GET',
        url: '/api/contacts'
      })

      const contacts = res.result

      expect(res.statusCode).to.equal(200)
      expect(contacts.length).to.equal(numberOfContacts)
      contacts.forEach(c => {
        const props = Object.keys(c)

        expect(props).to.have.length(2)
        expect(props).to.include('id')
        expect(props).to.include('fullName')
      })

      await server.stop()
    })
  })

  describe('Read Contact Tests', () => {
    let contactId
    const contact = Payload.contact()

    before(async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })

      contactId = res.result.id

      await server.stop()
    })

    after(async () => {
      await knex('addresses').del()
      await knex('contacts').del()
    })

    it('should be able to read contact by id', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'GET',
        url: `/api/contacts/${contactId}`
      })

      expect(res.statusCode).to.equal(200)
      const readContact = res.result

      expect(_.omit(readContact, ['addresses', 'id', 'createdAt', 'updatedAt'])).to.equal(_.omit(contact, ['addresses']))

      contact.addresses.forEach(addr => {
        const readAddress = readContact.addresses.find(cAddr => cAddr.street === addr.street)
        expect(readAddress).to.exist()
      })

      await server.stop()
    })

    it('should return 404 if contact not found', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'GET',
        url: `/api/contacts/${contactId + 99}`
      })

      expect(res.statusCode).to.equal(404)

      await server.stop()
    })
  })

  describe('Delete Contact tests', () => {
    const contact = Payload.contact()
    let contactId

    beforeEach(async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })

      contactId = res.result.id

      await server.stop()
    })

    afterEach(async () => {
      await knex('addresses').del()
      await knex('contacts').del()
    })

    it('should remove contact by id', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'DELETE',
        url: `/api/contacts/${contactId}`
      })

      expect(res.statusCode).to.equal(204)
      expect(res.result).to.be.null()

      await server.stop()
    })

    it('should return 404 if contact is not found', async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'DELETE',
        url: `/api/contacts/${contactId + 99}`
      })

      expect(res.statusCode).to.equal(404)

      await server.stop()
    })
  })

  describe('Update Contact Tests', () => {
    const contact = Payload.contact()
    let createdContact
    let contactId

    beforeEach(async () => {
      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'POST',
        url: '/api/contacts',
        payload: contact
      })

      createdContact = res.result
      contactId = res.result.id

      await server.stop()
    })

    afterEach(async () => {
      await knex('addresses').del()
      await knex('contacts').del()
    })

    it('should update basic data, removing addresses (no addresses in update payload)', async () => {
      const updatePayload = _.omit(Payload.contact(), ['addresses'])

      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'PUT',
        url: `/api/contacts/${contactId}`,
        payload: updatePayload
      })

      expect(res.statusCode).to.equal(200)

      const updatedContact = res.result
      expect(_.omit(updatedContact, ['updatedAt', 'createdAt', 'id'])).to.equal({ ...updatePayload, addresses: [] })

      await server.stop()
    })

    it('should include the new addresses provided in payload', async () => {
      const generatedPayload = Payload.contact()
      const updatePayload = {
        ...generatedPayload,
        addresses: [...createdContact.addresses, ...generatedPayload.addresses]
      }

      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'PUT',
        url: `/api/contacts/${contactId}`,
        payload: updatePayload
      })

      expect(res.statusCode).to.equal(200)

      const updatedContact = res.result

      expect(updatedContact.addresses).to.have.length(updatePayload.addresses.length)
      expect(_.omit(updatedContact, ['addresses', 'updatedAt', 'createdAt', 'id'])).to.equal(_.omit(updatePayload, ['addresses']))

      updatePayload.addresses.forEach(addr => {
        const updatedAddress = updatedContact.addresses.find(cAddr => cAddr.street === addr.street)
        expect(updatedAddress).to.exist()
      })

      await server.stop()
    })

    it('should update basic data and remove addresses that are not present in payload data, leaving the unmodified addresses untouched', async () => {
      const updatePayload = Payload.contact({
        addresses: createdContact.addresses.slice(1)
      })

      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'PUT',
        url: `/api/contacts/${contactId}`,
        payload: updatePayload
      })

      expect(res.statusCode).to.equal(200)

      const updatedContact = res.result
      expect(updatedContact.addresses).to.have.length(contact.addresses.length - 1)
      expect(_.omit(updatedContact, ['addresses', 'updatedAt', 'createdAt', 'id'])).to.equal(_.omit(updatePayload, ['addresses']))

      updatePayload.addresses.forEach(addr => {
        const updatedAddress = updatedContact.addresses.find(cAddr => cAddr.street === addr.street)
        expect(updatedAddress).to.exist()
      })

      await server.stop()
    })

    it('should update basic data and provided addresses, if changed', async () => {
      const newAddrNumber = 'new number'
      const generatedPayload = Payload.contact()
      const updatePayload = {
        ...generatedPayload,
        addresses: createdContact.addresses.map(addr => ({
          ...addr,
          number: newAddrNumber
        }))
      }

      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'PUT',
        url: `/api/contacts/${contactId}`,
        payload: updatePayload
      })

      expect(res.statusCode).to.equal(200)

      const updatedContact = res.result

      updatePayload.addresses.forEach(addr => {
        const updatedAddress = updatedContact.addresses.find(cAddr => cAddr.street === addr.street)
        expect(updatedAddress).to.exist()
        expect(updatedAddress.id).to.equal(addr.id)
        expect(updatedAddress.number).to.equal(newAddrNumber)
      })

      await server.stop()
    })

    it('should return 404 if contact not found', async () => {
      const updatePayload = Payload.contact()

      const server = await Server.init(internals.manifest, internals.composeOptions)

      const res = await server.inject({
        method: 'PUT',
        url: `/api/contacts/${contactId + 99}`,
        payload: updatePayload
      })

      expect(res.statusCode).to.equal(404)

      await server.stop()
    })
  })
})

internals.manifest = {
  server: { port: 0 },
  register: {
    plugins: [
      './api/contacts',
      './plugins/errorLogger',
      { plugin: './plugins/database', options: Config.get('/db') }
    ]
  }
}

internals.brokenManifest = {
  server: { port: 0 },
  register: {
    plugins: [
      './api/contacts',
      { plugin: './plugins/database', options: { client: 'pg', connection: { database: 'inexistent-db' } } }
    ]
  }
}

internals.composeOptions = {
  relativeTo: Path.resolve(__dirname, '../../../server')
}
