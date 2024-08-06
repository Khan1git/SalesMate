import React, { useState, useEffect } from 'react';
import './css/sidebar.css';
import { Home, Building2, Text, ReceiptText, BarChart, Users, Settings, LogOut, ShoppingCart, ShoppingBag, BadgeDollarSign, CookingPot } from 'lucide-react'
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
      // console.log("Result from API:", result); // Log the result for debugging
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
      // console.log(totalPrice)

    } catch (error) {
      toast.error("An Error Has Occured")
      // console.log(error)

    }
  }

  useEffect(() => {
    showAllproducts()
  }, [])

  // ----------------- FINDING THE TOTAL SALES ----------------
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState('')
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  // console.log(object)
  const [unpaid, setUnpaid]  = useState("")

  const showOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/getall', {
        method: 'GET', // Corrected method definition
        headers: {
          'Content-type': 'application/json',
        },
      });
      const result = await response.json();
      setOrders(result)

      let totalSales = 0;
      result.forEach(sale => {
        sale.products.forEach(product => {
          totalSales += product.price * product.quantity - product.discount;
        });
      });
      setSales(totalSales)

      let unpaidTotalSales = 0;
      const unpaid = result.filter(order => order.paid === false);
      setUnpaidOrders(unpaid);

      unpaid.forEach(order => {
        order.products.forEach(product => {
          unpaidTotalSales += product.price * product.quantity - product.discount;
        });
      });
      setUnpaid(unpaidTotalSales)

    } catch (error) {
      // console.error('Error sending data:', error);
      toast.error('An error occurred while sending data');
    }
  };

  useEffect(() => {
    showOrders();
  }, []);


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
            <p>{sales}</p></div>
          <div className="card4">
            <ShoppingBag />
            <p>total Purchases</p>
            <p>{totalPurchase}</p>
          </div>
        </div>
        <div className="Analytics">
          {/* <p>Customer And Sales</p><br/> */}
          <div className="graph">
            <Graph />
          </div>
          <div className="customer">
            <table  width="100%" className='client_table'>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone No</th>
                 
                </tr>
              </thead>
              <tbody>
                {Array.isArray(datas) && datas.map((customer, index) => (
                  <tr key={customer._id} >
                    <td>{index + 1}</td>
                    <td >{customer.name}</td>
                    <td>{customer.Address}</td>
                    <td>{customer.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table">
          <div className="product">
            <table border="1" width="100%" className='product_table'>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Per Sale Price</th>
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
