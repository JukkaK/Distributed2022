import { useState, useEffect } from 'react'
import Product from './components/Product'
import productService from './services/products'
import './App.css'

const App = () => {
  const order = [
    {
      "ean": 1111,
      "name": "product one",
      "amount": 0
    },
    {
      "ean": 2222,
      "name": "product two",
      "amount": 0
    },
    {
      "ean": 3333,
      "name": "product three",
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
    console.log('updating products')
    productService
    .getAll()
    .then(initialProducts => {
      setProducts(initialProducts)
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
    const shoppingList = event.filter(item => item.amount !== 0)
    console.log(shoppingList)

    const isItOut = shoppingList.filter(item => {
      const vastaava = products.find(e => e.ean === item.ean)
      if (item.amount > vastaava.amount) {
        return alert(`So sorry, but we are out of ${item.name}. Please remove the item from the shopping cart`);
      }
      return console.log('check done')
    })

    console.log(isItOut)

    // jos tavaraa riittävästi shoppingList lähetetään tässä kohden palvelimelle

    updateProducts()
    setCart(order);
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
        <h1>Coffee world</h1>
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
