import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom'; // Import Link from React Router
import Navbar from './Navbar';
import './Supplier.css';

function Sup_Email() {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const getAllData = async () => {
      const res = await axios.get("http://localhost:8070/inventory/Inv");
      setProducts(res.data);
    };
    getAllData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:8070/inventory/Inv/search?Product_Name=${value}`);
      setProducts(res.data);
      setValue("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <Navbar />
      <form className="d-flex" role="search" onSubmit={handleSearch}>
        <input className="form-control me-2"
          type="search"
          placeholder="Product Name"
          aria-label="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)} />
        <button className="btn btn-outline-success" type="submit">SEARCH</button>
      </form>
      <br></br>
      <h2 className="text-center"><b>ALL PRODUCT DETAILS</b></h2>
      <br></br>
      <br></br>
      <table className="table">
        <thead>
          <tr style={{ backgroundColor: '#053F5C', color: 'white' }}>
            <th scope="col">ID</th>
            <th scope="col">PRODUCT NAME</th>
            <th scope="col">QUANTITY</th>
            <th scope="col">SUPPLIER</th>
            <th scope="col">SEND EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map((product, index) => {
            return (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.Product_Name}</td>
                <td>{product.Quantity}</td>
                <td>{product.Supplier}</td>
                <td>
                  <Link to={`/SendEmailForm`}> {/* Pass supplier email and id */}
                    <button className='btn btn-primary'>SEND EMAIL</button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Sup_Email;
