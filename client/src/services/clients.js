import axios from 'axios'

const get = async () => {
  const res = (await axios.get('http://testfront.integrare.in/api/clients')).data
  return res
}
const create = async (values) => {
  const res = await axios.post('http://testfront.integrare.in/api/clients', values)
  return res
}
const remove = async (id) => {
  const res = await axios.delete(`http://testfront.integrare.in/api/clients/${id}`)
  return res
}
const edit = async (values, id) => {
  values['_method'] = 'PATCH'
  const res = await axios.post(`http://testfront.integrare.in/api/clients/${id}`, values)
  return res
}

export default {
  create,
  get,
  edit,
  remove
}
