import React, { useEffect, useState } from 'react'
import './css/customerdetails.css'
import Navbar from '../componentes/Navbar'
import { useParams } from 'react-router-dom'
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
    // console.log(unpaidInvoice)
    // console.log(id)

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
                                {customerInvoices.map((invoice, index) => {
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
