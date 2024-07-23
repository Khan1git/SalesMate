import React, { useEffect, useState } from 'react'
import './css/customerdetails.css'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Eye, Pen, Truck, Trash2 } from 'lucide-react'

import { Link } from 'react-router-dom'

function CustomerDetailsPage() {
    const { id } = useParams()
    const [customers, setCustomer] = useState([])
    const [customerInvoices, setCustomerInvoices] = useState([])
    const [customerProduct, setcustomerProd] = useState([])
    const [cost, setTotalCost] = useState(0)
    const [unpaidInvoice, setUnpaidInvoice] = useState([])
    const [unpaidCost, setUnpaidCost] = useState(0)
    const [payment, setPayment] = useState([])
    console.log(payment)


    const getUserByID = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/customer/findByid/${id}`, {
                method: "GET"
            })
            const result = await response.json()
            setCustomer(result)
            const totalCost = result.reduce((total, data) => {
                const productTotal = result.products.price * result.products.quantity;
                return total + productTotal;
            }, 0);
            setTotalCost(totalCost)
            // setCustomerId(result._id)
        } catch (error) {
            console.log('error in the getUserById in the Details page')
        }

    }

    useEffect(() => {
        getUserByID(id)
    }, [id])

    // ---------------- FETCHING ALL THE INVOICES--------------------

    const ShowAllorders = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/order/getall", {
                method: "GET"
            });
            const result = await response.json();
            const allInvoices = result.filter((order) => order.customer ? order.customer.customerId === id : 'not-found')
            // const unPaidInvoices = result.filter((order) => order.paid === false)
            const unPaidInvoices = allInvoices.filter((order) => !order.paid && order.customer.customerId === id)
            setCustomerInvoices(allInvoices)
            setUnpaidInvoice(unPaidInvoices)

            // -------- THE UNPAID COST
            const totalCost = unPaidInvoices.reduce((total, invoice) => {
                const invoiceTotal = invoice.products.reduce((invoiceSum, product) => {
                    return invoiceSum + (product.price * product.quantity);
                }, 0);
                return total + invoiceTotal;
            }, 0);
            setUnpaidCost(totalCost)

        } catch (error) {
            console.log("Fetching Orders Error", error);
        }
    };

    useEffect(() => {
        ShowAllorders();
    }, []);

    // ----------------- FETCHING PAYMENTS MADE BY CUSTOMERS-

    const showAllPayments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/order/all-payments', {
                method: "GET"
            })
            const result = await response.json()
            const customerPayment = result.filter((payment) => payment.name === id)
            setPayment(customerPayment)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { showAllPayments() }, [])

    // -------------- COMBINING THE TWO ARRAYS-------------

    const combinedData = [
        ...customerInvoices.map((invoice) => ({
            ...invoice,
            type: 'invoice',
        })),
        ...payment.map((pay) => ({
            ...pay,
            type: 'payment',
        })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    //----------------- DELTEING THE PAYMENT IF NEEDED

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
                    const response = await fetch(`http://localhost:5000/api/order/delete-payment/${id}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        showAllPayments();
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

    return (
        <>
            <Navbar />
            <section id="customer_details_section">
                <form action="">
                    <table width="40% " className="customer_table_Details">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone no</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers && (
                                <tr key={customers._id}>
                                    <td>{customers.name}</td>
                                    <td>{customers.phone}</td>
                                    <td>{unpaidCost}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="customer_section_tables">
                        <table width="100%" className="customer_info_table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>DATE</th>
                                    <th>DESCRIPTION</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Show</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {customerInvoices.map((invoice, index) => {
                                    const totalAmount = invoice.products.reduce((total, product) => {
                                        return total + (product.price * product.quantity)
                                    }, 0)
                                    return (
                                        <tr key={invoice._id}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td>Invoice No: {invoice.InvoiceNo} Issued</td>
                                            <td>{totalAmount}</td>
                                            <td>{invoice.paid ? "Paid" : "Unpaid"}</td>
                                            <td>
                                                <Link to={`/pdf/${invoice._id}`}><Eye size={20} color="#000000" strokeWidth={1} /></Link>
                                            </td>
                                            <td>
                                                <Link to={`/invoice/${invoice._id}`}><Pen size={20} color="#000000" strokeWidth={1} /></Link>
                                            </td>
                                        </tr>
                                    )
                                })} */}
                                {combinedData.map((data, index) => {
                                    if (data.type === 'invoice') {
                                        const totalAmount = data.products.reduce((total, product) => {
                                            return total + product.price * product.quantity;
                                        }, 0);
                                        return (
                                            <tr key={data._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {new Date(data.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td>Invoice #{data.InvoiceNo} Issued</td>
                                                <td>{totalAmount}</td>
                                                <td>{data.paid ? 'paid' : 'Unpaid'}</td>
                                                <td>
                                                    <Link to={`/pdf/${data._id}`}>
                                                        <Eye size={20} color="#000000" strokeWidth={1} />
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/invoice/${data._id}`}>
                                                        <Pen size={20} color="#000000" strokeWidth={1} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    } else if (data.type === 'payment') {
                                        return (
                                            <tr key={data._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {new Date(data.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td>{data.method} Payment</td>
                                                <td
                                                //   style={{"width": '60%'}}
                                                >{data.amount}</td>
                                                <td>
                                                    {/* <Eye size={20} color="#000000" strokeWidth={1} /> */}
                                                    Recieved
                                                </td>
                                                <td><Trash2 size={20} color="#000000" strokeWidth={1} onClick={() => handleDelete(data._id)} /></td>
                                                <td>
                                                    <Link to={`/payment/${data._id}`} >
                                                        <Pen size={20} color="#000000" strokeWidth={1} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="customer-left_section">
                        <div className="order_btns">
                            <button>Place Order</button>
                            <button>Update</button>
                        </div>
                    </div> */}
                </form>
            </section>
        </>
    )
}

export default CustomerDetailsPage
