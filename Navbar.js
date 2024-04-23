import React from 'react'
import {NavLink} from 'react-router-dom';
import './Supplier.css';


    const Navbar = () => {
    
    return (
    <nav className="navbar1  navbar-expand-lg fixed-top ">
        <div className="container-fluid">
             <h1 class="heading">  SUPPLIER MANAGEMENT OF SAI PHOTOGRAPHY </h1>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item1 text-dark">
                    <NavLink className="nav-link  text-dark" aria-current="page" exact to="/supplierHome"  >HOME</NavLink>
                </li>
                <li className="nav-item1 text-dark">
                    <NavLink className="nav-link text-dark" exact to="/add" activeClassName="active">INSERT</NavLink>
                </li>
                <li className="nav-item1">
                    <NavLink className="nav-link text-dark" exact to="/edit" activeClassName="active">VIEW</NavLink>
                </li>
                <li className="nav-item1">
                    <NavLink className="nav-link  text-dark" exact to="/view" activeClassName="active">REPORT </NavLink>
                </li>
                <li className="nav-item1">
                    <NavLink className="nav-link  text-dark" exact to="/Sup_Email" activeClassName="active">SEND EMAIL </NavLink>
                </li>
            </ul>
        </div>
        </div>
    </nav>
           
    )
}

export default Navbar