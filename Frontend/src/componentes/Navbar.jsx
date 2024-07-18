import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {  LayoutDashboard, CreditCard, ListOrdered, Text, ReceiptText, BarChart, Users, Settings, LogOut, ShoppingCart, ShoppingBag, BadgeDollarSign } from 'lucide-react'

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLinkClick = (e) => {
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
  };

  const handleCollapseClick = (e) => {
    const collapseMenu = e.target.nextElementSibling;
    collapseMenu.classList.toggle('showCollapse');
    const rotateIcon = e.target;
    rotateIcon.classList.toggle('rotate');
  };

  return (
    <>
      <div className={`l-navbar ${isExpanded ? 'expander' : ''}`} id="navbar">
        <nav className="nav">
          <div>
            <div className="nav__brand">
              <ion-icon name="menu-outline" className="nav__toggle" id="nav-toggle" onClick={toggleMenu}><Text /></ion-icon>
              <Link to="#" className="nav__logo"></Link>
            </div>
            <div className="nav__list">
              <Link to={"/"}>
                <Link to="/" className="nav__link " onClick={handleLinkClick}>
                  <LayoutDashboard />
                  <span className="nav__name">Dashboard</span>
                </Link>
              </Link>
              <Link to={'/customer-page'}>
                <div className="nav__link collapse" onClick={handleLinkClick} >
                  <ion-icon name="people-outline" className="nav__icon">
                    <Users />
                  </ion-icon>
                  <span className="nav__name">Customer</span>
                  <ion-icon name="chevron-down-outline" className="collapse__link"></ion-icon>
                </div>
              </Link>
              <Link to={'/product-page'}>
                <Link to="/product-page" className="nav__link" onClick={handleLinkClick}>
                  <ion-icon name="chatbubbles-outline" className="nav__icon"><ShoppingCart /></ion-icon>
                  <span className="nav__name">Product</span>
                </Link>
              </Link>
              <Link to={'/invoice-order'}>
                <Link to="/invoice-order" className="nav__link" onClick={handleLinkClick}>
                  <ion-icon name="settings-outline" className="nav__icon"><ReceiptText /></ion-icon>
                  <span className="nav__name">Place Order</span>
                </Link>
              </Link>
              <Link to={'/invoices'}>
                <Link to="/invoices" className="nav__link" onClick={handleLinkClick}>
                  <ion-icon name="pie-chart-outline" className="nav__icon"><ListOrdered /></ion-icon>
                  <span className="nav__name">Invoices</span>
                </Link>
              </Link>
              <Link to={'/payment'}>
                <Link to="/payment" className="nav__link" onClick={handleLinkClick}>
                  <ion-icon name="pie-chart-outline" className="nav__icon"><CreditCard /></ion-icon>
                  <span className="nav__name">Payment</span>
                </Link>
              </Link>
            </div>
          </div>
          {/* <Link to="#" className="nav__link" onClick={handleLinkClick}>
            <ion-icon name="log-out-outline" className="nav__icon"><LogOut /></ion-icon>
            <span className="nav__name">Logout</span>
          </Link> */}
        </nav>
      </div>

    </>
  )
}

export default Navbar
