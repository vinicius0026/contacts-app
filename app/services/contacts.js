const axios = require('axios')

const basePath = '/api/contacts'

const api = {
  create: () => basePath,
  listAll: () => basePath
}

const fakeList = [
  {
    id: 1,
    firstName: 'Nadia',
    lastName: 'Mauldin',
    birthday: new Date(1998, 0, 10),
    addresses: [
      {
        street: 'Ersel Street',
        number: '3899',
        zip: '75211',
        city: 'Dallas',
        state: 'TX'
      }
    ],
    phoneNumbers: [
      '2143334789'
    ],
    emails: [
      'nadia.mauldin@rhyta.com'
    ]
  }, {
    id: 2,
    firstName: 'Gina',
    lastName: 'Burke',
    birthday: new Date(1977, 4, 14),
    addresses: [
      {
        street: 'Cody Ridge Road',
        number: '2378',
        zip: '73082',
        city: 'Rush Springs',
        state: 'OK'
      }, {
        street: 'Village View Drive',
        number: '4284',
        zip: '33901',
        city: 'Fort Myers',
        state: 'FL'
      }
    ],
    phoneNumbers: [
      '5804766477'
    ],
    emails: [
      'ginajburke@teleworm.us',
      'ginaburke123@gmail.com'
    ]
  }, {
    id: 3,
    firstName: 'William',
    lastName: 'Porter',
    birthday: new Date(1934, 2, 25),
    addresses: [],
    phoneNumbers: [
      '9899836967'
    ],
    emails: [
      'williamlporter@teleworm.us'
    ]
  }
].sort((a, b) => {
  if (a.firstName > b.firstName) {
    return 1
  }
  if (a.firstName < b.firstName) {
    return -1
  }

  return 0
})

export async function load () {
  const res = await axios.get(api.listAll())
  console.log('res.data', res.data)
  return res.data
}

export async function create (data) {
  return axios.post(api.create(), data)
}

export default {
  load,
  create
}
