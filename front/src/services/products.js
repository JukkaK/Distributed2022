import axios from 'axios'
const baseUrl = 'http://localhost:3001/products'

const getAll = () => {
  const request = axios.get(baseUrl)

  return request.then(response => response.data)
}

const update = (id, newObject) => {
  console.log(newObject)
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, update }