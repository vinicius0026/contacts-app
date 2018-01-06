'use strict'

const Chance = require('chance')

const chance = new Chance()

module.exports = {
  contact
}

function contact (injected = {}) {
  return {
    firstName: chance.first(),
    lastName: chance.last(),
    birthday: chance.date({ year: chance.integer({ min: 1930, max: 2010 }) }),
    emails: emails(),
    phoneNumbers: phoneNumbers(),
    addresses: addresses(),
    ...injected
  }
}

function emails () {
  const possibleEmails = Array(3).fill(0)
    .map(i => chance.email())

  return chance.pickset(possibleEmails, chance.integer({ min: 1, max: 3 }))
}

function phoneNumbers () {
  const possiblePhones = Array(3).fill(0)
    .map(i => chance.phone())

  return chance.pickset(possiblePhones, chance.integer({ min: 1, max: 3 }))
}

function addresses () {
  const possibleAddresses = Array(3).fill(0)
    .map(i => ({
      street: chance.street(),
      number: `${chance.integer({ min: 1, max: 10000 })}`,
      zip: chance.zip(),
      city: chance.city(),
      state: chance.state()
    }))

  return chance.pickset(possibleAddresses, chance.integer({ min: 1, max: 3 }))
}
