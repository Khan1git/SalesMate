import React, { useState, useEffect } from 'react'
import './css/company.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar'
import Swal from 'sweetalert2'

const Company = () => {

    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [Address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const navigate = useNavigate();

    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/company/add", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, email, Address, phone, })
            });

            if (response.ok) {
                const successMessage = await response.text();
                toast.success('Company Data Added successfully');
                setCompanyName('');
                setAddress('');
                setEmail('');
                setPhone('');
            } else {
                toast.error("Please Provide all data");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ------------------ GETTING ALL ------------------
    const [companyData, setCompanyData] = useState([]);

    const showAllDetails = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/company/getbyid/65fb12ee055c636fb5a57ff2", {
                method: "GET",
            });
            const result = await response.json();
            // setCompanyData(result);
            setCompanyName(result.companyName)
            setEmail(result.email)
            setPhone(result.phone)
            setAddress(result.Address)
            // console.log(result)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showAllDetails();
    }, []);


    const handleUpdate = async (e) => {
        // e.preventDefault();
        try {

            const response = await fetch(`http://localhost:5000/api/company/update/65fb12ee055c636fb5a57ff2`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ companyName, email, Address, phone })
            });

            if (response.ok) {
                const updatedData = await response.json();
                // toast.success("Company Updated Successfully");
                Swal.fire({
                    title: 'Success!',
                    text: 'Data Updated Successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
            } else {
                toast.error("Failed to update company");
            }
        } catch (error) {
            console.error("Error updating company:", error);
            toast.error("An error has occurred");
        }
    };


    return (
        <>
            <Navbar />
            <section id="company_home">
                <div className="form">
                    <div className="side1">
                        <h1>Company Details</h1>
                        <input type="text" placeholder='Name' value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="number" placeholder='Phone No' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="text" placeholder='Address' value={Address} onChange={(e) => setAddress(e.target.value)} />
                        <div className="btns">
                            <button onClick={handleUpdate} className='comapny_btn'>Update</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Company;
