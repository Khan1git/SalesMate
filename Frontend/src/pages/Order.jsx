import Navbar from '../componentes/Navbar'
import './css/order.css'
import React, { useEffect, useState, } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XCircle, Pen, Truck, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2';

const Order = () => {

  const [customerID, setCustomerID] = useState('');
  const [item, setItem] = useState('');
  console.log(item)
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [customerAccountBalance, setCustomerAccountBalance] = useState(0);
  const [paid, setPaid] = useState(false);
  const [unit, setUnit] = useState('')

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    setPaid(e.target.checked);
  };


  const navigate = useNavigate()



  // ------------------ FETCHING THE CUSTOMERS -------------------------
  const [datas, setData] = useState([])

  const getAllcustomer = async (e) => {
    // e.preventDefault()
    try {
      const getCustomers = await fetch("http://localhost:5000/api/customer/getall", {
        method: "GET"
      })
      const result = await getCustomers.json()
      setData(result)
      // console.log("This is the customer")
      // console.log(result)
      // setCustomerAccountBalance(result.AccountBalance)
      // console.log(customerAccountBalance)
    } catch (error) {
      console.log("Some Error has occured in the GetAllCUstomer")
    }
  }

  useEffect(() => {
    getAllcustomer()
  }, [])

  //   ------------------ FETCHING THE PRODUCTS -------------------------
  const [products, setProducts] = useState([])
  const showAllproducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getall", {
        method: "GET"
      })
      const result = await response.json()
      //   let totalPrice = 0;
      //   result.forEach(product => {
      //     totalPrice += product.purchasePrice; 
      //   });
      //   setTotalPurchase(totalPrice)

      // Display or store the total price as needed

      setProducts(result)
    } catch (error) {
      toast.error("An Error Has Occured")
      console.log(error)

    }
  }

  useEffect(() => {
    showAllproducts()
  }, [])

  // ------------- ADDING DATA TO THE TABLE --------------
  const [tableData, setTableData] = useState([]);
  // console.log(tableData.)
  console.log(tableData)

  const handleAddToTable = () => {
    if (!customerID || !item || !quantity || !price) {
      toast.error('Please Enter All The Data');
      return;
    }
    // Add data to the table
    const newData = {
      customerID,
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

  const sendTableDataToBackend = async () => {
    try {
      // Creating a  payload including customer and product data
      const payload = {
        customer: {
          customerId: customerID,
          name: datas.find(customer => customer._id === customerID)?.name,
        },
        products: tableData.map(data => ({
          productId: data.productId,
          name: products.find(product => product._id === data.productId)?.productName,
          quantity: data.quantity,
          price: data.price,
          discount: data.discount,
          unit: data.unit
        })),
        paid: paid
      };

      const response = await fetch('http://localhost:5000/api/order/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const responseData = await response.json();
        const savedDataId = await responseData._id;

        if (!savedDataId) {
          throw new Error('Missing savedDataId in response data');
        }
        await Promise.all(tableData.map(async (data) => {
          const originalProduct = products.find(product => product._id === data.productId);
          const Name = await(originalProduct.productName)
          console.log("THIS IS THE ORIGINAL PRODUCT")
          if (originalProduct) {
            const newQuantity = originalProduct.quantity - data.quantity;
            if (newQuantity < 0) {
              toast.error('Not enough stock available for '+ Name);
              throw new Error('Not enough stock available');
            }
            else {
              const response = await fetch(`http://localhost:5000/api/product/update/${data.productId}`, {
                method: "PUT",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify({
                  quantity: newQuantity
                })
              });
              if (!response.ok) {
                throw new Error('Failed to update product quantity');
              }
            }
          }
        }));

        navigate(`/pdf/${savedDataId}`);

        setCustomerID('');
        setItem('');
        setQuantity('');
        setPrice('');
        setDiscount('');
        setTableData([]);
        toast.success('Data sent successfully');
      } else {
        toast.error('Failed To Place Order Please Try Again Later');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      // toast.error('Error Please try again later');
    }
  };



  // ------------ FETCHING THE DATA FROM THE DATABASE ------------
  const [orders, setOrders] = useState("");
  // console.log(orders);

  const showOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/getall', {
        method: 'GET', // Corrected method definition
        headers: {
          'Content-type': 'application/json',
        },
      });
      const result = await response.json();
      setOrders(result);
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error('An error occurred while sending data');
    }
  };

  useEffect(() => {
    showOrders();
  }, []);


  const handleDelete = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  // --------------- THE UPDATE METHODS ----------------------

  const { id } = useParams()
  // console.log(id)

  const [orderData, setOrderData] = useState({});
  const [product, setProduct] = useState([])
  console.log(product)

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/order/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      setOrderData(data);
      setCustomerID(data.customer.customerId)
      // setProduct(data.products)
      setTableData(data.products)
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Failed to fetch order data');
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);


  const handleUpdate = async () => {
    const payload = {
      customer: {
        customerId: customerID,
        name: datas.find(customer => customer._id === customerID)?.name,
      },
      products: tableData.map(data => ({
        productId: data.productId,
        name: products.find(product => product._id === data.productId)?.productName,
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        unit: data.unit
        
      })),
      paid: paid
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/order/updateorder/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        navigate("/");
        // alert("Post Updated....");
      }
    } catch (error) {
      console.log('DATA UPDATE FAILED');
    }
  };
  
  return (
    <>
      <Navbar />
      <section id="In_home">
        <h1>Place Order </h1>
        <div className="In_form">
          <form action="">
            <div className="center">
              <select name="Select CUSTOMER" id="productSelect" onChange={(e) => setCustomerID(e.target.value)}>
                <option value="">Select Customer</option>
                {datas.map(customer => (
                  <option key={customer._id} value={`${customer._id}`}>{customer.name}</option>
                ))}
              </select>
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
              <input type="text" placeholder='unit' value={unit} onChange={(e) => setUnit(e.target.value)} />
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
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
            {/* <div className="center">
                <input type="number" placeholder='TOTAL AMOUNT' value={} onChange={(e) => setIdno(e.target.value)} /> */}
            {/* </div> */}
            <div className="order_btns">
              {/* <button >Updat/e</button> */}
              <button type="button" onClick={handleAddToTable}>Add</button>
              <button > clear </button>
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
                <th>Customer ID</th>
                <th>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{customerID}</td>
                <td>{datas.find(customer => customer._id === customerID)?.name}</td>
                {/* <td>{paid}</td> */}
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
                  <td onClick={handleDelete} ><XCircle size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className='btn' onClick={sendTableDataToBackend}>Place Order</button>
        <button className='btn' onClick={handleUpdate}>Update</button>
      </section>
    </>
  )
}
export default Order