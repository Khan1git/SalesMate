import './css/customerpage.css'
import Navbar from '../componentes/Navbar'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'

import { XCircle, Pen, UserRoundSearch} from 'lucide-react'


function CustomerPage() {
    const [datas, setData] = useState([])
    // console.log(datas)

    const [name, setname] = useState("")
    const [email, setemal] = useState("")
    const [Address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    // const [idno, setIdno] = useState("")
    const [AccountBalance, setAccountBalance] = useState("")
    const [search, setSearch] = useState("")
    const [totalCustomers, setTotalCustomers] = useState(0)
    const navigate = useNavigate();

    // =================== THE ADDING CUSTOMER API ==================================
    const HandleaddCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/customer/create", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ name, email, Address, phone, AccountBalance }) // Corrected field name
            });

            if (response.ok) {
                const successMessage = await response.text();
                Swal.fire({
                    title: 'Success!',
                    text: 'Customer added successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                toast.success('Customer Added successfully Relaod The Page');
                setname("");
                setemal("");
                setAddress("");
                setPhone("");
                setAccountBalance("");
            } else {
                const errorMessage = await response.text();
                Swal.fire({
                    title: 'error!',
                    text: 'Please Provide all the data',
                    icon: 'error',
                    confirmButtonText: 'Cool'
                })
                // toast.error("Please Provide all data");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again later.");
        }
    };


    // ===================== FETCHING ALL AVALIABLE CUSTOMERS ===========================
    const getAllcustomer = async (e) => {
        // e.preventDefault()
        try {
            const getCustomers = await fetch("http://localhost:5000/api/customer/getall", {
                method: "GET"
            })
            const result = await getCustomers.json()
            const filteredItems = result.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
            setData(filteredItems)

        } catch (error) {
            console.log("Some Error has occured in the GetAllCUstomer")
        }
    }

    useEffect(() => {
        getAllcustomer()
    }, [search])

    // ----------------------------- DELETING COUSTOMERS ---------------------------
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this customer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api/customer/deletebyid/${id}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        getAllcustomer()
                        Swal.fire({
                            title: 'Success!',
                            text: 'Customer deleted successfully',
                            icon: 'success',
                            confirmButtonText: 'Cool'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete customer',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while deleting the customer',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });
    }

    // ------------------- THE CUSTOMER UPDATE LOGIC -------------------
    const [currentCustomer, setCurrentCustomer] = useState(null);
    // console.log(currentCustomer._id)
    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setname(customer.name);
        setemal(customer.email);
        setAddress(customer.Address);
        setPhone(customer.phone);
        setAccountBalance(customer.AccountBalance);
    };

    const handleUpdate = async (e, id) => {
        // e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/customer/updatebyid/${currentCustomer._id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ name, email, Address, phone, AccountBalance })
            });
            if (response.ok) {
                const updatedData = await response.json();
                setData(updatedData);
                Swal.fire({
                    title: 'Success!',
                    text: 'Customer Updated Successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                // toast.success("Customer Updated Successfully");
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire({
                title: 'error!',
                text: 'Failed to update User',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            // toast.error("An error has occurred");
        }
    };

    // ---------- HADNLING THE TRASHES -----------------
    const handleClear = (e) => {
        e.preventDefault()
        setname("");
        setemal("");
        setAddress("");
        setPhone("");
        setAccountBalance("");
    };
    // 
    // toast.success("Everytthing is wo")

    // --------------------- THE PAID AND UNPAID DRAMA -------------

    const [orders, setOrders] = useState({});
    const [paidCount, setPaidCount] = useState(0); // State for counting paid orders
    const [unpaidCount, setUnpaidCount] = useState(0); // State for counting unpaid orders

    const showOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/order/getall', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const result = await response.json();

            // // Calculate paid and unpaid counts
            // let paid = 0;
            // let unpaid = 0;
            // result.forEach(order => {
            //     if (order.paid) {
            //         paid++;
            //     } else {
            //         unpaid++;
            //     }
            // });

            // Update state with orders and counts
            setOrders(result);
            // setPaidCount(paid);
            // setUnpaidCount(unpaid);
        } catch (error) {
            console.error('Error sending data:', error);
            toast.error('An error occurred while sending data');
        }
    };

    useEffect(() => {
        showOrders();
    }, []);

    return (
        <>
            <Navbar />
            <section id="customer_table_home">
                <form action="">
                    <div class="customer_table_fields">
                        <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setname(e.target.value)} />
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setemal(e.target.value)} />
                        <input type="text" placeholder="Address" value={Address} onChange={(e) => setAddress(e.target.value)} />
                        <input type="Number" placeholder="P No"  value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="Number" placeholder="Account Balance" value={AccountBalance} onChange={(e) => setAccountBalance(e.target.value)} />
                    </div>
                    <div class="customer_tables">
                        <input type="search" name="" id="" placeholder='Search Customers..'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <table width="100%" class="customer_info_table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Customer Name</th>
                                    <th>Email</th>
                                    <th>Pno</th>
                                    <th>Address</th>
                                    <th>Account Balance</th>
                                    <th>Delete</th>
                                    <th>Update</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(datas) && datas.map((customer, index) => (
                                    <tr key={customer._id}>
                                        <td>{index + 1}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.Address}</td>
                                        <td>${customer.AccountBalance}</td>
                                        <td className='icon_style'><XCircle size={16} onClick={() => handleDelete(customer._id)} /></td>
                                        <td className='icon_style'><Pen size={16} onClick={() => handleEdit(customer)} /></td>
                                        <td className='icon_style'><UserRoundSearch  size={16} onClick={()=> navigate(`/customer-details/${customer._id}`)}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div class="customer_left">
                        <div class="order_btns">
                            <button onClick={HandleaddCustomer}>Add Customer</button>
                            <button onClick={handleUpdate}>Update</button>
                        </div>
                        {/* <table width="30%" className='total_table '>
                            <thead>
                                <tr>
                                    <th>Total Amount</th>
                                    <td>{totalCustomers}</td>
                                </tr>
                            </thead>
                        </table> */}
                    </div>
                </form>
            </section>


        </>
    )
}

export default CustomerPage
