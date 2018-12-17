import axios from 'axios'

const getSales = async (period) => {
  return (await axios.post('http://testfront.integrare.in/api/getSales', period)).data
}
const sales = async (values) => {
  console.log(values)
  const res = await axios.post('http://testfront.integrare.in/api/sales', values)
  return res
}
export default {
  sales,
  getSales
}
