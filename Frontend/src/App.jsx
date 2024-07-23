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
import InvoiceOrder from './pages/InvoiceOrder';
import ProductPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import Payment from './pages/Payment';
import TemorderPage from './pages/TemorderPage';
import TempInvoicePage from './pages/TempInvoicePage';
import TempInvoiceDisplayPage from './pages/TempInvoiceDisplayPage';

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
        <Route path="/invoice-order" element={<InvoiceOrder />} />
        <Route path="/invoice/:id" element={<InvoiceOrder />} />
        <Route path="/product-page" element={<ProductPage />} />
        <Route path="/customer-page" element={<CustomerPage />} />
        <Route path="/customer-details/:id" element={<CustomerDetailsPage />} />

        {/* ------------- THE PAYMENT --------------- */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/:id" element={<Payment />} />

        {/* --------------- TEMP ORDER SECTION */}
        <Route path="/temp-order" element={<TemorderPage />} />
        <Route path="/temp-order/:id" element={<TemorderPage />} />
        <Route path="/temp-invoice/:id" element={<TempInvoicePage />} />
        <Route path="/show-temp-invoices" element={<TempInvoiceDisplayPage />} />
      </Routes>
    </Router>
  )
}

export default App
