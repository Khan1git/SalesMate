import Navbar from '../componentes/Navbar'
import './css/order2.css'
import React, { useEffect, useState, } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XCircle, Pen, Truck, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2';

const Order2 = () => {

  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [paid, setPaid] = useState(false);
  const [unit, setUnit] = useState('')


  // -------------------------- showing All Avaliable Products
  const [products, setProducts] = useState([])
  const showAllproducts = async (req, res) => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getall", {
        method: "GET"
      })
      const result = await response.json()
      setProducts(result)
    } catch (error) {
      console.log('Error In Fetching Products At tempOrder')
    }
  }

  useEffect(() => {
    showAllproducts()
  }, [])

  //--------------------------------- ADDING ORDER DATA TO THE TABLE
  const [tableData, setTableData] = useState([]);

  const handleAddToTable = () => {
    if (!customerName || !item || !quantity || !price) {
      toast.error('Please Enter All The Data');
      return;
    }
    const newData = {
      customerName,
      productId: item,
      quantity,
      price,
      discount,
      unit
    };
    setTableData([...tableData, newData]);
    setItem('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setUnit('')
  };

  

  return (
    <>
      <Navbar />
      <section id="In_home">
        {/* <h1>Place Order </h1> */}
        <div className="In_form">
          <form action="">
            <label htmlFor="">TEMPORARY CUSTOMER ORDER</label>
            <div className="center">
              <input type="text" placeholder='Customer Name..' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <select name="Select Product" id="productSelect" onChange={(e) => setItem(e.target.value)}>
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>{product.productName}</option>
                ))}
              </select>
            </div>
            <div className="center2">
              <input type="text" placeholder='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input type="Number" placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
              {/* <input type="number" placeholder='DISCOUNT' value={discount} onChange={(e) => setDiscount(e.target.value)} /> */}
              <input type="text" placeholder='Unit' value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            {/*  The Status section ---------------------------------- */}
            <div>
              <div className="center1">
                <label htmlFor="paid">Paid</label>
                <input
                  type="checkbox"
                  className='check'
                  name="paid"
                  checked={paid}
                // onChange={handleCheckboxChange}
                />
              </div>
            </div>
            {/* <div className="center">
                <input type="number" placeholder='TOTAL AMOUNT' value={} onChange={(e) => setIdno(e.target.value)} /> */}
            {/* </div> */}
            <div className="order_btns">
              {/* <button >Updat/e</button> */}
              <button type="button"
               onClick={handleAddToTable}
              >Add</button>
              {/* <a href='/order'>
              Customer
              </a> */}
            </div>
          </form>
        </div>
      </section>
      <section id="In_list">
        <h1>PRODUCT DETAILS</h1>
        <div className="list">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{customerName}</td>
              </tr>
            </tbody>
          </table>
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Delete</th>
                {/* <th>Update</th> */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td >{data.productId} </td>
                  <td>{products.find(product => product._id === data.productId)?.productName}</td>
                  <td>{data.quantity} </td>
                  <td>{data.price} </td>
                  <td>{data.unit ? data.unit : "others"}</td>
                  <td 
                  // onClick={handleDelete} 
                  ><XCircle size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <button className='btn' onClick={sendTableDataToBackend}>Place Order</button>
        <button className='btn' onClick={handleUpdate}>Update</button> */}
      </section>
    </>
  )
}
export default Order2