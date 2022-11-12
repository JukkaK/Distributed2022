import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios'

axios.get('http://localhost:3001/products').then(response => {
  const products = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App products={products} />
  )
})
