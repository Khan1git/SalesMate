import React, { useState, useEffect } from 'react';
import './css/sidebar.css';
import { Home, Building2, Text, ReceiptText, BarChart, Users, Settings, LogOut, ShoppingCart, ShoppingBag, BadgeDollarSign } from 'lucide-react'
import Graph from './graph';
import Piechart from './Piechart';
import InvoiceTable from './InvoiceTable';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';


const Sidebar = () => {

  // ------------- SHOWING ALL CUSTOMER AND PRODUCT DATABSE -----------------------

  const [counts, setCount] = useState(null)
  const [productCounts, setProductCount] = useState(null)
  const countCustomers = async () => {
    try {
      const getCustomers = await fetch("http://localhost:5000/api/customer/countall", {
        method: "GET"
      });
      const result = await getCustomers.json();
      setCount(result);
    } catch (error) {
      console.log("Error fetching customer count:", error);
    }
  };

  useEffect(() => {
    countCustomers()
  }, [])
  const countProducts = async () => {
    try {
      const countAllproducts = await fetch("http://localhost:5000/api/product/countall", {
        method: "GET"
      });
      const result = await countAllproducts.json();
      console.log("Result from API:", result); // Log the result for debugging
      setProductCount(result);
    } catch (error) {
      console.log("Error fetching customer count:", error);
    }
  };

  useEffect(() => {
    countProducts()
  }, [])

  // ====================== FETCHING THE CUSTOMERS DATA =========================
  const [datas, setData] = useState([])
  const getAllcustomer = async (e) => {
    // e.preventDefault()
    try {
      const getCustomers = await fetch("http://localhost:5000/api/customer/getall", {
        method: "GET"
      })
      const result = await getCustomers.json()
      setData(result)

    } catch (error) {
      console.log("Some Error has occured in the GetAllCUstomer")
    }
  }

  useEffect(() => {
    getAllcustomer()
  }, [])

  // / -------------------- SHOWING TOATL PURCHASES -----------
  const [products, setProducts] = useState([])
  const [pdata, setPdata] = useState([])
  // console.log(products)
  const [totalPurchase, setTotalPurchase] = useState("")
  const showAllproducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getall", {
        method: "GET"
      })
      const result = await response.json()
      setProducts(result)
      setPdata(result)
      let totalPrice = 0;
      result.forEach(product => {
        totalPrice += product.purchasePrice * product.quantity;
      });
      setTotalPurchase(totalPrice)

    } catch (error) {
      toast.error("An Error Has Occured")
      console.log(error)

    }
  }

  // console.log(pdata)

  useEffect(() => {
    showAllproducts()
  }, [])


  return (
    <>
      <Navbar />
      <div className="contnet">
        <div className="head">
          <h1>Welcome Admin</h1>
          <Link to={'/company'}>
            <button>Company Info</button>
          </Link>
        </div>
        {/* <marquee behavior="scroll" direction="left" scrollamount="10">Almost Completed Adding Some More features</marquee> */}
        <div className="cards">
          <div className="card1">
            <Users />
            <p>total Customers</p>
            <p>{counts}</p>
          </div>
          <div className="card2">
            <ShoppingCart />
            <p>total Products</p>
            <p>{productCounts}</p>
          </div>
          <div className="card3">
            <BadgeDollarSign />
            <p>total Sales</p>
            <p>$2300.2</p></div>
          <div className="card4">
            <ShoppingBag />
            <p>total Purchases</p>
            <p>0</p>
          </div>
        </div>
        <div className="Analytics">
          {/* <p>Customer And Sales</p><br/> */}
          <div className="graph">
            <Graph />
          </div>
          <div className="customer">
            {/* customers */}
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone No</th>
                  {/* <th></th> */}
                  {/* <th>Total Purchase Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(datas) && datas.map((customer, index) => (
                  <tr key={customer._id} >
                    <td>{index + 1}</td>
                    <td >{customer.name}</td>
                    <td>{customer.Address}</td>
                    <td>{customer.phone}</td>
                    {/* <td>10000</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table">
          <div className="product">
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Per Sale Price</th>
                  {/* <th>Category</th> */}
                  <th>Total Purchase Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(products) && products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>${product.purchasePrice}</td>
                    <td>${product.saleprice}</td>
                    {/* <td>{product.category}</td> */}
                    <td>${product.purchasePrice * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <Piechart />
          </div>
        </div>
        <div className="purchases">
          <InvoiceTable />
        </div>
        <footer>
          <div className="footer-content">
            <p>&copy; 2024 Billing Admin Dashboard. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Sidebar;
