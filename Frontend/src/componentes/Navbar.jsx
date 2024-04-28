import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, Truck, Text, ReceiptText,BarChart, Users, Settings, LogOut, ShoppingCart, ShoppingBag, BadgeDollarSign } from 'lucide-react'

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
              <a href="#" className="nav__logo"></a>
            </div>
            <div className="nav__list">
            <Link to={"/"}>
              <a href="#" className="nav__link active" onClick={handleLinkClick}>
                <LayoutDashboard />
                <span className="nav__name">Dashboard</span>
              </a>
            </Link>
            <Link to={'/customer'}>
              <div className="nav__link collapse" onClick={handleLinkClick} >
                <ion-icon name="people-outline" className="nav__icon"><Users /></ion-icon>
                <span className="nav__name">Customer</span>
                <ion-icon name="chevron-down-outline" className="collapse__link"></ion-icon>
                {/* <ul className="collapse__menu">
                  <a href="#" className="collapse__sublink">Data</a>
                  <a href="#" className="collapse__sublink">Group</a>
                  <a href="#" className="collapse__sublink">Members</a>
                </ul> */}
              </div>
                </Link>
                <Link to={'/product'}>
              <a href="#" className="nav__link" onClick={handleLinkClick}>
                <ion-icon name="chatbubbles-outline" className="nav__icon"><ShoppingCart /></ion-icon>
                <span className="nav__name">Product</span>
              </a>
                </Link>
            <Link to={'/order/:id'}>
            <a href="#" className="nav__link" onClick={handleLinkClick}>
                <ion-icon name="settings-outline" className="nav__icon"><Truck /></ion-icon>
                <span className="nav__name">Place Order</span>
              </a>
            </Link>
            <Link to={'/invoices'}>
            <a href="#" className="nav__link" onClick={handleLinkClick}>
                <ion-icon name="pie-chart-outline" className="nav__icon"><ReceiptText /></ion-icon>
                <span className="nav__name">Invoices</span>
              </a>
             
            </Link>
            </div>
          </div>
          <a href="#" className="nav__link" onClick={handleLinkClick}>
            <ion-icon name="log-out-outline" className="nav__icon"><LogOut /></ion-icon>
            <span className="nav__name">Logout</span>
          </a>
        </nav>
      </div>
      
    </>
  )
}

export default Navbar
