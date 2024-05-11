import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import Sidebar from './componentes/Sidebar';
import Customer from './pages/Customer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Products from './pages/Product';
import InvoicePDF from './componentes/InvoicePDF';
import Invoices from './pages/Invoices';
import Order from './pages/Order';
import Company from './pages/Company';
import UpdateOrder from './pages/UpdateOrder';
import Analytics from './pages/Analytics';

const App = () => {
  return (
    <Router>
      <ToastContainer theme="dark" autoClose="2000" />
      <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route path="/company" element={<Company />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/product" element={<Products />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/pdf/:id" element={<InvoicePDF />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/order" element={<Order />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  )
}

export default App
