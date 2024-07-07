import React, { useState, useEffect } from 'react';
import './css/company.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Swal from 'sweetalert2';

const Company = () => {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [Address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isCompanyDataAvailable, setIsCompanyDataAvailable] = useState(false);
    const [data, setData] = useState([]);
    const [id, setId] = useState('');

    const navigate = useNavigate();

    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/company/add", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, email, Address, phone })
            });

            if (response.ok) {
                toast.success('Company Data Added successfully');
                setIsCompanyDataAvailable(true);
                showAllDetails();
            } else {
                toast.error("Failed to add company. Please provide all data.");
            }
        } catch (error) {
            console.log("Error adding company:", error);
            toast.error("An error occurred while adding company data.");
        }
    };

    const showAllDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/company/get', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
                if (result.length > 0) {
                    const firstCompany = result[0]; 
                    setId(firstCompany._id);
                    setCompanyName(firstCompany.companyName);
                    setAddress(firstCompany.Address);
                    setEmail(firstCompany.email);
                    setPhone(firstCompany.phone);
                    setIsCompanyDataAvailable(true);
                } else {
                    setIsCompanyDataAvailable(false);
                    console.log("No company data found.");
                }
            } else {
                setIsCompanyDataAvailable(false);
                console.log("Failed to fetch company data.");
            }
        } catch (error) {
            setIsCompanyDataAvailable(false);
            console.error('Error sending data:', error);
            toast.error('An error occurred while sending data');
        }
    };

    useEffect(() => {
        showAllDetails();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/company/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, email, Address, phone })
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Data Updated Successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                });
                showAllDetails(); 
            } else {
                toast.error("Failed to update company");
            }
        } catch (error) {
            console.error("Error updating company:", error);
            // toast.error("An error has occurred");
        }
    };

    return (
        <>
            <Navbar />
            <section id="company_home">
                <div className="form">
                    <div className="side1">
                        <h1>Company Details</h1>
                        <form onSubmit={isCompanyDataAvailable ? handleUpdate : handleAddCompany}>
                            <input
                                type="text"
                                placeholder='Name'
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder='Phone No'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Address'
                                value={Address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="btns">
                                <button type="submit" className='company_btn'>
                                    {isCompanyDataAvailable ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Company;
