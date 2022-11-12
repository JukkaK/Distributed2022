import './Product.css'
import { useState } from 'react'

const Product = ({ product, makeOrder }) => {
  const [newOrder, setNewOrder] = useState(0)

  const addToCart = (event) => {
    event.preventDefault()
    makeOrder(event, product.ean, newOrder)
    setNewOrder(0)
  }
/*
  const handleOrderChange = (event) => {
    setNewOrder(event.target.value)
  }
*/
  return (
    <div className="product-wrapper">
      <div className='product'>
        <img src={require(`../assets/${product.pic}`)} alt={product.name}/>
        <h2>
          {product.name}
        </h2>
        <div className='options'>
          <p>Availability</p>
          <div className={`box${product.amount >= 20 ? "-good" : product.amount >= 1 ? "-low" : "-out"}`}>
          <p>
            {product.amount >= 20 ? "good" : product.amount >= 1 ? "low" : "out of stock"}
          </p>
          </div>
          <form onSubmit={addToCart}>
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  )
}
/*
<input
value={newOrder}
onChange={handleOrderChange}
pattern="^-?[1-9]\d*\.?\d*$"
/>
*/

export default Product