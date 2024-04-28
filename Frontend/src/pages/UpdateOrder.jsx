import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../componentes/Navbar'

const UpdateOrder = () => {

    
  // ------------------ THE UPDATE FUNCTIONS --------------------------------
  const { id } = useParams()
  console.log(id)

  const [orderData, setOrderData] = useState({
    customerID: '',
    item: '',
    quantity: '',
    price: '',
    discount: '',
    customerAccountBalance: 0,
    paid: false,
  });


  const fetchOrderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/order/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      setTableData([data])
       // setOrderData(data);
        // setCustomerID(data.customer.customerId);
        // setItem(data.products[0].productId);
        // setQuantity(data.products[0].quantity);
        // setPrice(data.products[0].price);
        // setDiscount(data.products[0].discount);
        // setPaid(data.paid);
      console.log(data)
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Failed to fetch order data');
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  return (
    <>
    <Navbar/>
      <h1>THIS IS FOR UPDATING THE ORDER DATA</h1>
    </>
  )
}

export default UpdateOrder