import React, { useState, useEffect } from 'react';
import './css/payment.css';
import Navbar from '../componentes/Navbar';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';

function Payment() {
    const [customerId, setCustomerId] = useState(''); // Customer ID if needed
    const [customerName, setCustomerName] = useState('');
    const [balance, setBalance] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const params = useParams()
    const id = params.id
    const navigate = useNavigate()

    // Fetching all available customers
    const [customers, setCustomers] = useState([]);

    const getAllCustomers = async () => {
        try {
            const getCustomers = await fetch("http://localhost:5000/api/customer/getall", {
                method: "GET"
            });
            const result = await getCustomers.json();
            setCustomers(result);
        } catch (error) {
            console.log("Some error has occurred in the getAllCustomers");
        }
    };

    useEffect(() => {
        getAllCustomers();
    }, []);


    // Adding payment method
    const handleSubmit = async () => {
        const paymentDetails = {
            name: customerId,
            balance,
            date,
            amount,
            method: paymentMethod
        };
        try {
            const response = await fetch('http://localhost:5000/api/order/add-payment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentDetails)
            });
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Payment Added Successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                setCustomerId('')
                setAmount('')
                setBalance('')
                setDate('')
                setPaymentMethod('')
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to Add Payment',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            console.log('Payment registered successfully:', result);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to Payment',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.log('Error registering payment:', error);
        }
    };

    //------------ UPDATING THE paYMENT--------------

    const [idPyament, setIdPyament] = useState([])

    console.log(idPyament)
    const getPaymentById = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/find-payment/${id}`, {
                method: "GET"
            })
            const result = await response.json()
            setIdPyament(result)
            setBalance(result.balance)
            setAmount(result.amount)
            // setDate(result.date)
            setCustomerId(result.name)
            setPaymentMethod(result.method)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getPaymentById()
    }, [])

    //------------------------- udpating the Payment -----------------
    const [update, setUpdated]= useState([])

    const handleUpdate = async () => {
        const paymentDetails = {
            name: customerId,
            balance,
            date,
            amount,
            method: paymentMethod
        };
        try {
            const response = await fetch(`http://localhost:5000/api/order/update-payment/${id}`, {
                method: "PUT",
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(paymentDetails)
            })
            const result = await response.json()
            setUpdated(result)
            navigate(`/customer-details/${result.name}`)
            

        } catch (error) {
            alert('failed to update')
            console.log(error, "can't updat th payemnt")
        }
    }
    return (
        <>
            <Navbar />
            <section id="payment_details_section">
                <h1>Payment</h1>
                <div className="payment_ui">
                    <label htmlFor="customer">Customer</label>
                    <select
                        name="customer"
                        value={customerId}
                        onChange={(e) => {
                            setCustomerId(e.target.value);
                            const selectedCustomer = customers.find(c => c._id === e.target.value);
                            setCustomerName(selectedCustomer ? selectedCustomer.name : '');
                        }}
                    >
                        <option value="">Select a customer</option>
                        {customers.map((customer) => (
                            <option key={customer._id} value={customer._id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="Balance">Balance</label>
                    <input
                        type="number"
                        name="Balance"
                        placeholder="Balance"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                    />
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <label htmlFor="amount">Amount In</label>
                    <input
                        type="text"
                        name="amount"
                        placeholder="Total Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="payment-options">
                        <label htmlFor="payment-method">Payment Method:</label>
                        <input
                            type="radio"
                            id="cash"
                            name="payment-method"
                            value="Cash"
                            checked={paymentMethod === 'Cash'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cash">Cash</label>
                        <input
                            type="radio"
                            id="cheque"
                            name="payment-method"
                            value="Cheque"
                            checked={paymentMethod === 'Cheque'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cheque">Cheque</label>
                        <input
                            type="radio"
                            id="demand-draft"
                            name="payment-method"
                            value="Demand Draft"
                            checked={paymentMethod === 'Demand Draft'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="demand-draft">Demand Draft</label>
                        <input
                            type="radio"
                            id="bank-transfer"
                            name="payment-method"
                            value="Bank Transfer"
                            checked={paymentMethod === 'Bank Transfer'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="bank-transfer">Bank Transfer</label>
                    </div>

                    <div className="payment_btn">
                        <button type="button" onClick={handleSubmit}>Register</button>
                        <button type="button" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Payment;
