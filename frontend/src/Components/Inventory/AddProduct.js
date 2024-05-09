import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [rquantity, setRquantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const inventoryData = {
      name,
      type,
      category,
      date,
      rquantity,
      totalPrice,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8070/api/Product/add",
        inventoryData
      );
  
      if (response.status === 201) {
        navigate("/InventoryMnagement");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div  style={{ backgroundImage: 'url("Images/back2.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh' }}>
      <Navbar/>
    <div className="container mt-5" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="card">
        <div className="card-header">
          <h1>Add Products</h1>
          <button className="btn btn-danger float-right" onClick={navigateBack}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-3">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              className="form-control"
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option value="Mens">Mens</option>
              <option value="Womens">Womens</option>
              <option value="Kids">Kids</option>
              <option value="Hair coloring products">Hair coloring products</option>
              <option value="Furniture">Furniture</option>
              <option value="Brushes">Brushes</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Product">Product</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rquantity">Remaining quantity</label>
            <input
              type="text"
              className="form-control"
              id="rquantity"
              name="rquantity"
              value={rquantity}
              onChange={(e) => setRquantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalPrice">Total Price</label>
            <input
              type="text"
              className="form-control"
              id="totalPrice"
              name="totalPrice"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}


