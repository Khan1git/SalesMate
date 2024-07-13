import Navbar from '../componentes/Navbar';
import './css/invoiceStyle.css'
import { XCircle, Pen, Truck, Trash2 } from 'lucide-react'
import React, { useEffect, useState, } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import InvoicePDF from '../componentes/InvoicePDF';

const InvoiceOrder = () => {


  const [customerID, setCustomerID] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [customerAccountBalance, setCustomerAccountBalance] = useState(0);
  const [paid, setPaid] = useState(false);
  const [unit, setUnit] = useState('')
  const [payment, setPayment] = useState('')
  const [cost, setCost] = useState(0)

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
  const handleAddToTable = (e) => {
    e.preventDefault()
    if (!customerID || !item || !quantity || !price) {
      toast.error('Please Enter All The Data');
      return;
    }
    // Add data to the table
    const newData = {
      customerID,
      productId: item,
      quantity,
      price: parseFloat(price),
      discount,
      unit,
      payment
    };
    setTableData([...tableData, newData]);
    const newTotalCost = cost + parseFloat(price) * quantity;
    setCost(newTotalCost) 

    setItem('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setUnit('')
  };

  // -------- SENDING DATA TO THE BACKEND ADDING THE ORDER

  const sendTableDataToBackend = async (e) => {
    e.preventDefault()
    try {
      // Creating a payload including customer and product data
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
          unit: data.unit,
        })),
        paid: paid,
        payment,
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

        //---------------- CALCULATING THE TOTAL COST OF THE PRODUCTS
        const totalCost = tableData.reduce((total, data) => {
          const productTotal = data.price * data.quantity;
          return total + productTotal;
        }, 0);

        // Update product quantities
        await Promise.all(
          tableData.map(async (data) => {
            const originalProduct = products.find(product => product._id === data.productId);
            const Name = await (originalProduct.productName);
            console.log("THIS IS THE ORIGINAL PRODUCT");
            if (originalProduct) {
              const newQuantity = originalProduct.quantity - data.quantity;
              if (newQuantity < 0) {
                toast.error('Not enough stock available for ' + Name);
                throw new Error('Not enough stock available');
              } else {
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
          })
        );

        // Update customer balance
        const customerResponse = await fetch(`http://localhost:5000/api/customer/findByid/${customerID}`);
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          const currentBalance = customerData.AccountBalance;
          const newBalance = currentBalance + totalCost;

          const updateBalanceResponse = await fetch(`http://localhost:5000/api/customer/updatebyid/${customerID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              AccountBalance: newBalance,
            }),
          });

          if (!updateBalanceResponse.ok) {
            throw new Error('Failed to update customer balance');
          }
        } else {
          throw new Error('Failed to fetch customer data');
        }

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
      toast.error('Error Please try again later');
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
  // console.log(product)

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/order/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      setOrderData(data);
      setCustomerID(data.customer.customerId)
      setPayment(data.payment)
      setTableData(data.products)
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Failed to fetch order data');
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);


  const handleUpdate = async (e) => {
    e.preventDefault()
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
      paid: paid,
      payment
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
      <section id="Invoice_home">
        <form action="">
          <div class="fields">
            {/* <!-- <label for="">PLACE ORDER</label> --> */}
            <select name="Select CUSTOMER" id="productSelect" onChange={(e) => setCustomerID(e.target.value)}>
              <option value="">CUSTOMERS</option>
              {datas.map(customer => (
                <option key={customer._id} value={`${customer._id}`}>{customer.name}</option>
              ))}
            </select>
            <select name="Select Product" id="productSelect" onChange={(e) => setItem(e.target.value)}>
              <option value="">PRODUCTS</option>
              {products.map(product => (
                <option key={product._id} value={`${product._id}`}>{product.productName}</option>
              ))}
            </select>
            <input type="Number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="Number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <input type="text" placeholder="Payment Method" value={payment} onChange={((e) => setPayment(e.target.value))} />
            <button onClick={handleAddToTable}>Add</button>
          </div>
          <div class="tables">
            <table width="60%" class="customer_table">
              <thead>
                <tr>
                  <th
                    style={{ display: 'none' }}
                  >Customer ID</th>
                  <th>Customer Name</th>
                  {/* <th>Invoice No</th> */}
                  <th>Payment Method</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ display: 'none' }}
                  >{customerID}</td>
                  <td>{datas.find(customer => customer._id === customerID)?.name}</td>
                  {/* <td></td> */}
                  <td>{payment}</td>
                  <td>
                    <input type="checkbox"
                      className='check'
                      name="paid"
                      onChange={handleCheckboxChange}
                      checked={paid} />
                  </td>
                </tr>
              </tbody>
            </table>
            <table width="100%" className='product_table'>
              <thead>
                <tr>
                  <th>No</th>
                  <th
                    style={{ display: 'none' }}
                  >Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td
                      style={{ display: 'none' }}
                    >{data.productId} </td>
                    <td>{products.find(product => product._id === data.productId)?.productName}</td>
                    <td>{data.quantity} </td>
                    <td>{data.price} </td>
                    <td>{data.unit ? data.unit : "others"}</td>
                    <td onClick={(e) => handleDelete(index)} ><XCircle size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="left">
            <div class="order_btns">
              <button onClick={sendTableDataToBackend}>Place Order</button>
              <button onClick={handleUpdate}>Update</button>
            </div>
            <table width="30%" className='total_table '>
              <thead>
                <tr>
                  <th>Total Amount</th>
                  <td>{cost}</td>
                </tr>
              </thead>

            </table>
          </div>
        </form>
      </section>
    </>
  );
};

export default InvoiceOrder;
