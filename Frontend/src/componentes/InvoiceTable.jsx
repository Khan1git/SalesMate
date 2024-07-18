import React, { useEffect, useState } from 'react'
import './css/invoicetable.css'
import { Link } from 'react-router-dom'

import { Eye, MoveRight } from 'lucide-react'

const InvoiceTable = () => {
  const [orders, setOrders] = useState([])

  const [price, setPrice] = useState('')
  const [search, setSearch] = useState("")


  // console.log(price)
  console.log(orders)

  const ShowAllorders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/order/getall", {
        method: "GET"
      })
      const result = await response.json()
      // const filteredOrders = result.filter(order =>
      //   order.customer.name.toLowerCase().includes(search.toLowerCase())
      // );

      setOrders(result);
    } catch (error) {
      console.log("Fetching Orders Error")
    }
  }

  useEffect(() => {
    ShowAllorders()
  }, [search])


  return (
    <>
      <div id='invoiceTable'>
        <div className="headers">
          {/* <input type="search" style={{
            border: "none",
            outline: "none"
          }}
            name=""
            id=""
            value={search}
            // onChange={handleSearchChange}
            onChange={(e) => setSearch(e.target.value)}
            className='table_search'
            placeholder='search by customer...'
          /> */}
          <Link to={'/invoices'}>
            <MoveRight size={20} color="#000000" strokeWidth={2} />
          </Link>
        </div>
        <table border="1" width="100%" className='Home_customer_table'> 
          <thead>
            <tr>
              <th>No</th>
              {/* <th>Invoice Id</th> */}
              <th>Customer Name</th>
              <th>Products</th>
              <th>Price</th>
              <th>Quantity</th>
              {/* <th>Amount</th> */}
              {/* <th>Discount</th> */}
              <th>Tota Amount</th>
              <th>Opt</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                {/* <td>INV{(order._id).slice(0, 5)}</td> */}
                <td>{order.customer? order.customer.name : 'temp customer'}</td>
                <td>
                  <select className='select' id="productSelect" >
                    {order.products.map(product => (
                      <option key={product._id} value={`${product._id}`}>{product.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select className='select' id="productSelect" >
                    {order.products.map(product => (
                      <option key={product._id} value={`${product._id}`}>${product.price}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select className='select' id="productSelect" >
                    {order.products.map(product => (
                      <option key={product._id} value={`${product._id}`}>{product.quantity}</option>
                    ))}
                  </select>
                </td>
                <td>
                  ${order.products.reduce((total, product) => total + product.price * product.quantity, 0)}
                </td>
                {/* <td>
                  ${order.products.reduce((total, product) => total + product.discount, 0) || 0}
                </td> */}
                {/* <td>
                  $ {order.products.reduce((total, product) => total + product.price, 0) - order.products.reduce((total, product) => total + product.discount, 0)}
                </td> */}
                <td>
                  <Link to={`/pdf/${order._id}`}><Eye size={20} color="#000000" strokeWidth={1} /></Link>
                </td>
                <td>
                  {/* {order.paid ? 'Paid' : 'Unpaid'} */}
                  {order.paid ? (
                    <>
                      <div style={{
                        // border: "1px solid green",
                        textAlign: "center",
                        borderRadius: "12px",
                        backgroundColor: "#33bf33",
                        color: "white",
                        margin: 0,
                        width: "3rem",
                        fontSize: "x-small",

                      }}>
                        Paid
                      </div>
                    </>
                  ) : <p style={{
                    // border: "1px solid red",
                    textAlign: "center",
                    margin: 0,
                    backgroundColor: "#ff0000c2",
                    color: "white",
                    width: "3rem",
                    fontSize: "x-small",
                    borderRadius: "12px"

                  }}>Unpaid</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  )
}

export default InvoiceTable
