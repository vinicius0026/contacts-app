import axios from 'axios'
import { parse as parseDate } from 'date-fns'

const basePath = '/api/contacts'

const api = {
  create: () => basePath,
  listAll: () => basePath,
  read: id => `${basePath}/${id}`
}

export async function load () {
  const res = await axios.get(api.listAll())
  return res.data
}

export function create (data) {
  return axios.post(api.create(), data)
}

export async function read (id) {
  const res = await axios.get(api.read(id))
  return {
    ...res.data,
    birthday: parseDate(res.data.birthday)
  }
}

export default {
  load,
  create,
  read
}
