import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/product.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Navbar from '../componentes/Navbar'

import { XCircle, Pen, Truck, Trash2 } from 'lucide-react'

const Product = () => {
  const [products, setProducts] = useState([])
  const [productName, setproductName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setquantity] = useState("")
  const [saleprice, setSetsalePrice] = useState("")
  const [purchasePrice, setpurchasePrice] = useState("")
  const [totalPurchase, setTotalPurchase] = useState("")
  const [search, setSearch] = useState("")
  const [unit, setUnit] = useState('')

  // ---------- HADNLING THE TRASHES -----------------
  const handleClear = (e) => {
    // e.preventDefault()
    setname("");
    setemal("");
    setAddress("");
    setPhone("");
    setIdno("");
    setAccountBalance("");
  };

  // ------------- FETCHING ALL AVALIABLE PRODUCTS -------------------

  const showAllproducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getall", {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
        },
      })
      const result = await response.json()
      let totalPrice = 0;
      result.forEach(product => {
        totalPrice += product.purchasePrice; // Assuming each product object has a 'price' property
      });
      setTotalPurchase(totalPrice)

      const filteredItems = result.filter(item =>
        item.productName.toLowerCase().includes(search.toLowerCase())
      );
      // console.log(filteredItems)

      setProducts(filteredItems);


      // setProducts(result)
    } catch (error) {
      toast.error("An Error Has Occured")
      console.log(error)

    }
  }

  useEffect(() => {
    showAllproducts();
  }, [search]);


  // ------------------ THE ADDING RPODUCT SECTION -----------------

  const handleAddProduct = async (e) => {
    // e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/product/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ productName, category, quantity, saleprice, purchasePrice, unit })
      })
      if (response.ok) {
        const successMessage = await response.text();
        Swal.fire({
          title: 'success',
          text: 'Product Added successfully',
          icon: 'success'
        })
        // toast.success('Product Added successfully');
      } else {
        // const errorMessage = await response.text();
        Swal.fire({
          title: 'error',
          text: 'Please Provide All The Information',
          icon: 'error'
        })
        // toast.error("Please Provide all data");
      }
    } catch (error) {
      // console.log(error)
      Swal.fire({
        title: 'error',
        text: 'Please Provide All The Information',
        icon: 'error'
      })
      // toast.error("Error Please Provide All The Information")

    }
  }

  // ----------- DELTEING THE PRODUCTS ----------------------------

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this product',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/product/delete/${id}`, {
            method: "DELETE"
          });
          if (response.ok) {
            showAllproducts()
            Swal.fire({
              title: 'Success!',
              text: 'product deleted successfully',
              icon: 'success',
              confirmButtonText: 'Cool'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete product',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the product',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });

  }

  // ------------ UPDATING THE PRODUCTS ---------------
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleEdit = (product) => {
    setCurrentProduct(product);

    setproductName(product.productName);
    setCategory(product.category);
    setquantity(product.quantity);
    setSetsalePrice(product.saleprice);
    setpurchasePrice(product.purchasePrice);
    setUnit(product.unit);
    // alert(product.unit)
    // setAccountBalance(customer.AccountBalance);
  };

  const handleUpdate = async (e, id) => {
    // e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/product/update/${currentProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ productName, category, quantity, saleprice, purchasePrice, unit })
      })
      if (response.ok) {
        const updatedData = await response.json();
        setProducts(updatedData);
        Swal.fire({
          title: 'Success!',
          text: 'Product Updated Successfully',
          icon: 'success',
          confirmButtonText: 'Cool'
        });
        // toast.success("Product Updated Successfully");
      } else {
        toast.error("Failed to update Product");
      }
    } catch (error) {
      Swal.fire({
        title: 'error!',
        text: 'Failed to update Product',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
      // toast.error("Error Please Try Again Later")
    }
  }

  return (
    <>
      <Navbar />
      <section id="p_home">
        {/* <h2 style={{ textAlign: 'center' }}>ADD PRODCUTS</h2> */}
        <div className="p_form">
          <form action="">
            <div className="p_center">
              <label htmlFor="">Product Details</label>
              <input type="text" placeholder='Product Name' name='product' value={productName} onChange={(e) => setproductName(e.target.value)} />
              {/* <input type="text" placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} /> */}
            </div>
            <div className='p_mid'>
            <input type="number"  placeholder='Quantity' value={quantity} onChange={(e) => setquantity(e.target.value)} />
            {/* <input type="text" placeholder='Avaliability' /> */}
            </div>
            <div className="p_center2">
              <input type="Number" placeholder='Sale Price' value={saleprice} onChange={(e) => setSetsalePrice(e.target.value)} />
              <input type="Number" placeholder='Purchase price' value={purchasePrice} onChange={(e) => setpurchasePrice(e.target.value)} />
              <input type="text" placeholder='Unit' value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            {/* <input type="number" placeholder='Account Balance' /> */}
            <div className="product_btns">
              <button onClick={handleUpdate} >Update</button>
              <button onClick={handleAddProduct} > Add </button>
              <button onClick={handleClear} > clear </button>
            </div>
          </form>
        </div>
      </section>
      <section id="p_list">
        <h2 style={{ textAlign: 'center' }}>ALL PRODCUTS</h2>
        <input
          type="search"
          className="p_search "
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="list1">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>unit</th>
                {/* <th>category</th> */}
                <th>Quantity</th>
                <th>cost/unit</th>
                <th>sale Price</th>
                <th>Total Cost</th>
                <th>Delete</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.productName}</td>
                  <td>{product.unit ? product.unit : "others"}</td>
                  {/* <td>{product.category}</td> */}
                  <td>{product.quantity}</td>
                  <td>{product.purchasePrice}</td>
                  <td>{product.saleprice}</td>
                  <td>{product.purchasePrice * product.quantity}</td>
                  <td><XCircle size={16} onClick={(e) => handleDelete(product._id)} /></td>
                  <td><Pen size={16} onClick={() => handleEdit(product)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default Product
