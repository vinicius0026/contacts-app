import capitalize from 'lodash/capitalize'

function create (input) {
  const { firstName, lastName, phoneNumbers, emails, addresses } = input

  if (!firstName) {
    throw new Error('Please fill contact\'s first name')
  }

  if (!lastName) {
    throw new Error('Please fill contact\'s last name')
  }

  if (!phoneNumbers || !phoneNumbers.length) {
    throw new Error('Please provide at least one phone number')
  }

  if (!emails || !emails.length) {
    throw new Error('Please provide at least one email address')
  }

  validateAddresses(addresses)
}

function validateAddresses (addresses) {
  if (addresses) {
    addresses.forEach(validateAddress)
  }
}

function validateAddress (address) {
  const requiredKeys = ['street', 'number', 'zip', 'city', 'state']

  requiredKeys.forEach(key => {
    if (!address[key]) {
      throw new Error(`Please check the provided addresses. ${capitalize(key)} is required.`)
    }
  })
}

export const contact = {
  create
}
