import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import Sidebar from './componentes/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoicePDF from './componentes/InvoicePDF';
import Invoices from './pages/Invoices';
import Company from './pages/Company';
import Analytics from './pages/Analytics';
import Order2 from './pages/Order2';
import InvoiceOrder from './pages/InvoiceOrder';
import ProductPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage';

const App = () => {
  return (
    <Router>
      <ToastContainer theme="dark" autoClose="2000" />
      <Routes>
        <Route path="/" element={<Sidebar />} />
        <Route path="/company" element={<Company />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/pdf/:id" element={<InvoicePDF />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/walk-order" element={<Order2 />} />
        <Route path="/invoice-order" element={<InvoiceOrder />} />
        <Route path="/invoice/:id" element={<InvoiceOrder />} />
        <Route path="/product-page" element={<ProductPage />} />
        <Route path="/customer-page" element={<CustomerPage />} />
      </Routes>
    </Router>
  )
}

export default App
