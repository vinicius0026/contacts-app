'use strict'

const _ = require('lodash')

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
        .orderBy('first_name')

      return contacts.map(c => ({
        id: c.id,
        fullName: c.fullName
      }))
    }
  }

  class Address extends BaseModel {
    static get tableName () {
      return 'addresses'
    }
  }

  Contact.knex(knex)
  Address.knex(knex)

  return Contact
}
