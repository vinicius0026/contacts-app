import axios from 'axios'
import { parse as parseDate } from 'date-fns'
import omit from 'lodash/omit'

const basePath = '/api/contacts'

const api = {
  create: () => basePath,
  listAll: () => basePath,
  read: id => `${basePath}/${id}`,
  remove: id => `${basePath}/${id}`,
  update: id => `${basePath}/${id}`
}

export async function load () {
  const res = await axios.get(api.listAll())
  return res.data
}

export async function create (data) {
  const res = await axios.post(api.create(), data)
  return replaceDateStringWithObject(res.data)
}

export async function update (data) {
  const res = await axios.put(api.update(data.id), omit(data, ['id']))
  return replaceDateStringWithObject(res.data)
}

export async function read (id) {
  const res = await axios.get(api.read(id))
  return replaceDateStringWithObject(res.data)
}

export function remove (id) {
  return axios.delete(api.remove(id))
}

function replaceDateStringWithObject (obj) {
  return {
    ...obj,
    birthday: obj.birthday ? parseDate(obj.birthday) : null
  }
}

export default {
  load,
  create,
  read,
  update,
  remove
}
