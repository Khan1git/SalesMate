import React, { useState, useEffect } from 'react'
import './css/invoice.css'
import Navbar from '../componentes/Navbar'
import { Eye, Pen, Truck, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const Invoices = () => {

  const [orders, setOrders] = useState([])
  const [price, setPrice] = useState('')
  const [search, setSearch] = useState("")
  const [time, setTime] = useState([])
  // console.log(orders)


  // console.log(price)
  // console.log(orders)

  const ShowAllorders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/order/getall", {
        method: "GET"
      });
      const result = await response.json();
      
      const filteredOrders = result.filter(order =>
        order.customer && order.customer.name && 
        (search ? order.customer.name.toLowerCase().includes(search.toLowerCase()) : true)
      );
  
      setOrders(filteredOrders);
      setTime(result);
    } catch (error) {
      console.log("Fetching Orders Error", error);
    }
  };
  
  useEffect(() => {
    ShowAllorders();
  }, [search]);
  

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this order',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/order/deletebyid/${id}`, {
            method: "DELETE"
          });
          if (response.ok) {
            ShowAllorders();
            Swal.fire({
              title: 'Success!',
              text: 'Order deleted successfully',
              icon: 'success',
              confirmButtonText: 'Cool'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete order',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the order',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });

  };

  // const FormattedDate = new Date(order.date).toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // });

  // console.log(FormattedDate);


  return (
    <>
      <Navbar />
      <section id="invoice">
        {/* <h1 style={{ textAlign: "center" }}>ALL INVOICES</h1> */}
        {/* <>INVOICES</> */}
        <div className="btns">
          <input type="search" name="" id="" placeholder='Search by Customer Name...' value={search}
            // onChange={handleSearchChange}
            onChange={(e) => setSearch(e.target.value)} />
          <Link to={'/invoice-order'}>
            <button>ALL INVOICES</button>
          </Link>
        </div>
        <div className="invoice_table">
          <table  width="100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Products</th>
                <th>Price</th>
                <th>Quantity</th>
                {/* <th>Price</th> */}
                {/* <th>Discount</th> */}
                <th>Tota Amount</th>
                <th>Status</th>
                <th>Show</th>
                <th>Delete</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.reverse().map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>INV{(order._id).slice(0, 9)}</td>
                  <td>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', })}</td>
                  <td>{order.customer.name}</td>
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
                        <option key={product._id} value={`${product._id}`}>{product.price}</option>
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
                  {/* <td>
                    ${order.products.reduce((total, product) => total + product.price * product.quantity, 0)}
                  </td> */}
                  {/* <td>
                    ${order.products.reduce((total, product) => total + product.discount, 0) || 0}
                  </td> */}
                  <td>
                    {order.products.reduce((total, product) => total + product.price * product.quantity, 0) - order.products.reduce((total, product) => total + product.discount, 0)}
                  </td>
                  <td>
                    {order.paid ? (
                      <>
                        <div style={{
                          // border: "1px solid green",
                          textAlign: "center",
                          borderRadius: "12px",
                          backgroundColor: "#33bf33",
                          color: "white",
                          margin: 0,
                          width: "3.5rem",
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
                      width: "3.5rem",
                      fontSize: "x-small",
                      borderRadius: "12px"

                    }}>Unpaid</p>}
                  </td>
                  <td>
                    <Link to={`/pdf/${order._id}`}><Eye size={20} color="#000000" strokeWidth={1} /></Link>
                  </td>
                  <td>
                    <Trash2 size={20} onClick={() => handleDelete(order._id)} color="#000000" strokeWidth={1} />
                  </td>
                  <td>
                    <Link to={`/invoice/${order._id}`}><Pen size={20} color="#000000" strokeWidth={1} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pages">
          <button>Next</button>
        </div>
      </section>
    </>
  )
}

export default Invoices