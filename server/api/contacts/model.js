'use strict'

const _ = require('lodash')
const Boom = require('boom')

const internals = {}

internals.BaseModel = require('../../util/BaseModel')

module.exports = function (di) {
  Object.assign(internals, di)

  const { BaseModel, knex } = internals

  class Contact extends BaseModel {
    static get tableName () {
      return 'contacts'
    }

    static get virtualAttributes () {
      return ['fullName']
    }

    get fullName () {
      return `${this.firstName} ${this.lastName}`
    }

    static get relationMappings () {
      return {
        addresses: {
          relation: BaseModel.HasManyRelation,
          modelClass: Address,
          join: {
            from: 'contacts.id',
            to: 'addresses.contact_id'
          }
        }
      }
    }

    static async create (data) {
      const contact = await Contact.query().insert(_.omit(data, ['addresses']))

      const { addresses } = data

      await Promise.all(addresses.map(
        addr => contact.$relatedQuery('addresses')
          .insert(addr)
      ))

      return contact
    }

    static async listAll (data) {
      const contacts = await Contact.query()
        .select('id', 'first_name', 'last_name')
        .orderBy(knex.raw('lower(first_name)'))
        .orderBy(knex.raw('lower(last_name)'))

      return contacts.map(c => ({
        id: c.id,
        fullName: c.fullName
      }))
    }

    static async read (id) {
      const [contact] = await Contact.query()
        .where('id', id)

      if (!contact) {
        throw Boom.notFound('Contact not found')
      }

      await contact.$relatedQuery('addresses')

      return contact
    }

    static async remove (id) {
      const contact = await Contact.read(id)
      const addressesIds = contact.addresses.map(addr => addr.id)

      await Address.query()
        .delete()
        .whereIn('id', addressesIds)

      await Contact.query()
        .delete()
        .where('id', id)
    }

    static async update (id, payload) {
      const contact = await Contact.query()
        .patch(_.omit(payload, ['addresses', 'id']))
        .where('id', id)
        .first()
        .returning('*')

      if (!contact) {
        throw Boom.notFound()
      }

      await contact.$relatedQuery('addresses')

      // Deal with removed Addresses
      const previousAddressesIds = contact.addresses.map(addr => addr.id)
      const newAddressesIdsSet = payload.addresses.map(addr => addr.id)
        .filter(id => id)
        .reduce((set, id) => {
          set.add(id)
          return set
        }, new Set())
      const removedAddressesIds = previousAddressesIds.filter(id => !newAddressesIdsSet.has(id))

      await Address.query()
        .delete()
        .whereIn('id', removedAddressesIds)

      // Deal with created or updated addresses
      await Promise.all(payload.addresses.map(addr => Address.createOrUpdate(id, addr)))

      await contact.$relatedQuery('addresses')

      return contact
    }
  }

  class Address extends BaseModel {
    static get tableName () {
      return 'addresses'
    }

    static async createOrUpdate (contactId, payload) {
      if (!payload.contactId) {
        return Address.create(contactId, payload)
      }

      return Address.update(payload)
    }

    static async create (contactId, payload) {
      return Address.query()
        .insert({
          ...payload,
          contactId
        })
    }

    static async update (payload) {
      return Address.query()
        .patch(_.omit(payload, ['id']))
        .where('id', payload.id)
    }
  }

  Contact.knex(knex)
  Address.knex(knex)

  return Contact
}
