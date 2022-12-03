import React, { useState, useEffect } from 'react'
import Product from './components/Product'
import { getAllProducts, editAmount } from './services/products'
import './App.css'

const App = () => {
  const order = [
    {
      "ean": 1111,
      "name": "gift one",
      "amount": 0
    },
    {
      "ean": 2222,
      "name": "gift two",
      "amount": 0
    },
    {
      "ean": 3333,
      "name": "gift three",
      "amount": 0
    }
  ]

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(order)

  useEffect(() => {
    updateProducts()
 
    const interval = setInterval(() => {
        //update products every 10 sec
        updateProducts()
      }, 10000)
      return () => clearInterval(interval)
  }, [])

  const updateProducts = () => {
    getAllProducts()
    .then(initialProducts => {
      setProducts(initialProducts.documentResponse)
    })
  }

  const makeOrder = (event, ean) => {
    event.preventDefault()
    const newOrder = cart.map((item) => {
      if (item.ean === ean) {
        return { ...item, amount: item.amount + 1 };
      } else {
        return item 
      }
    });
    setCart(newOrder);
  }
  
  const placeOrder = (event) => {
    updateProducts()
    //create the shoppingList
    const shoppingList = event.filter(item => item.amount !== 0)

    //check availability
    shoppingList.filter(item => {
      const vastaava = products.find(e => e.ean === item.ean)
      if (item.amount > vastaava.amount) {
        shoppingList.splice(shoppingList.findIndex(e => e.ean === item.ean),1);
        return alert(`So sorry, we have item ${item.name} only ${vastaava.amount}. Items will be removed`);
      }
      return console.log("we have it")
    })

    //place the order to backend and empty the cart
    shoppingList.map(product => purchase(product))
    updateProducts()
    setCart(order);
    }

  const purchase = (product) => {
    editAmount(product).then(response => {
      console.log("reply", response)
    })
  }

  const removeItem = (event) => {
    const removeOne = cart.map((item) => {
      if (item.ean === event) {
        return { ...item, amount: 0 };
      } else {
        return item 
      }
    });
    setCart(removeOne);
  }

  return (
    <div className='container'>
      <div className='title'>
        <h1>Gift shop</h1>
      </div>      
      <ul>
        {products.map(product => 
          <Product
            key={product.ean}
            product={product}
            makeOrder={makeOrder}
          />
        )}
      </ul>
      <h2>Shopping cart</h2>
      <div className='cart-container'>
        <ul>
          {cart.map((ord, i) => {
            return ord.amount > 0 ? 
              <p key={i}>{ord.name} {ord.amount} pcs <button className='btn' onClick={() => removeItem(ord.ean)}>Remove</button></p>  :
              <p key={i}></p>
            }
          )}
        </ul>
        <button className='btn-buy' onClick={() => placeOrder(cart)}>
          Buy
        </button>
      </div>
    </div>
  )
}

export default App
