import React, { useEffect, useState } from "react";
//import "./updateProduct.css";
//import close from "./images/close.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [rquantity, setRquantity] = useState("");
 
  const [totalPrice, setTotalPrice] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/Product/update/" + id)
      .then((result) => {
        console.log(result);
        setName(result.data.name);
        setType(result.data.type);
        setCategory(result.data.category);
        setDate(result.data.date);
        setRquantity(result.data.rquantity);
      
        setTotalPrice(result.data.totalPrice);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
   
    axios
      .put("http://localhost:8070/api/Product/update/" + id, {
        name,
        type,
        category,
        date,
        rquantity,
       
        totalPrice,
      })
      .then((result) => {
        console.log(result);
        // Optional: Navigate to another page or perform other actions
        navigate("/InventoryMnagement");
      })
      .catch((err) => console.log(err));
  };
  

 
  const navigteBack = () => {
    navigate(-1);
  };

  return (
    <div className="updateProduct-page">
      <div className="updateProduct-container">
        <form onSubmit={handleUpdate}>
          <button className="close-button">
            <img onClick={navigteBack} className="close-icon"  />
          </button>

          <h1>Update Products</h1>

          <div className="updateProduct-input-box">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className="updateProduct-select-box">
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Not Selected">Select type</option>
              <option value="Mens">Mens</option>
              <option value="Womens">Womens</option>
              <option value="Kids">Kids</option>
              {/* <option value="Hair coloring products">
                Hair coloring products
              </option>
              <option value="Furniture">Furniture</option>
              <option value="Brushes">Brushes</option> */}
            </select>
          </div>

          <div className="updateProduct-select-box">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Not Selected">Select Category</option>
              <option value="Product">Product</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="updateProduct-date-input">
            <label htmlFor="date">Date</label> <br />
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="updateProduct-input-box">
            <input
              type="text"
              id="rquantity"
              name="rquantity"
              value={rquantity}
              onChange={(e) => setRquantity(e.target.value)}
              required
            />
            <label htmlFor="rquantity">Remaining quantity</label>
          </div>

          
         

          <div className="updateProduct-input-box">
            <input
              type="text"
              id="totalPrice"
              name="totalPrice"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
            />
            <label htmlFor="totalPrice">Total Price</label>
          </div>

          <button type="submit" className="updateProduct-button">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
