import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaSearch } from "react-icons/fa";
import Navbar from "./Navbar";

export default function InventoryMnagement() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [originalInventory, setOriginalInventory] = useState([]); // Store original inventory data
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/Product/products")
      .then((items) => {
        setInventory(items.data);
        setOriginalInventory(items.data); // Set original inventory data
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (confirmDelete) {
      axios
        .delete("http://localhost:8070/api/Product/delete/" + id)
        .then((res) => {
          console.log("Delete successful:", res);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const addProductClick = () => {
    navigate("/AddProduct");
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    filterInventory(event.target.value);
  };

  const filterInventory = (query) => {
    if (query === "") {
      // If search query is empty, display original inventory
      setInventory(originalInventory);
    } else {
      const filtered = originalInventory.filter((item) =>
        Object.keys(item).some(
          (key) =>
          key !== "rquantity" &&
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .startsWith(query.toLowerCase())
        )
      );
      setInventory(filtered);
    }
  };
  

  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8070/api/Product/products"
      );
      const inventoryData = response.data;

      const doc = new jsPDF();

      const headerX = doc.internal.pageSize.width - 20;

      doc.setFontSize(14);
      doc.text("Sai Photography", headerX, 20, { align: "right" });

      doc.setFontSize(12);
      doc.text(" Colombo, Malabe", headerX, 27, {
        align: "right",
      });
      doc.setFontSize(10);
      doc.text("077-1234567", headerX, 32, {
        align: "right",
      });

      doc.setLineWidth(0.5);
      doc.line(8, 42, 200, 42);

      doc.setFont("bold");
      doc.setFontSize(20);
      doc.text("Inventory Report", 80, 60);
      doc.setFont("normal");

      doc.setDrawColor(0);

      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Name", dataKey: "name" },
        { header: "Type", dataKey: "type" },
        { header: "Category", dataKey: "category" },
        { header: "Date", dataKey: "date" },
        { header: "Remaining qty", dataKey: "remaning" },
        // { header: "Used qty", dataKey: "used" },
        { header: "Price", dataKey: "price" },
      ];

      const rows = inventoryData.map((inventory, index) => ({
        id: index + 1,
        name: inventory.name,
        type: inventory.type,
        category: inventory.category,
        date: inventory.date,
        remaning: inventory.rquantity,
      
        price: inventory.totalPrice,
      }));

      autoTable(doc, { columns, body: rows, startY: 70 });

      doc.save("Inventory Report.pdf");
    } catch (error) {
      console.error("Error fetching or generating PDF:", error);
    }
  };

  return (
    <div  style={{ backgroundImage: 'url("Images/back2.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh' }}>
      <Navbar/>
    <div className="container mt-4" style={{ backgroundColor: "#E5E5E5" }}>
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Inventory Management</h1>
          <div className="d-flex justify-content-between">
            <button
              onClick={addProductClick}
              className="btn btn-primary"
            >
              Add new product
            </button>
            <button onClick={downloadPDF} className="btn btn-secondary">
              Report
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Search Products Through Prices, Category And Names"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="form-control"
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
          <table className="table">
            <thead>
              <tr style={{ backgroundColor: '#053F5C', color: 'white' }}>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Remaining qty</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {error && <tr><td colSpan="8" style={{ color: 'red' }}>Error: {error}</td></tr>}
              {inventory.map((inventory, index) => {
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'table-primary' : ''}>
                    <td>{index + 1}</td>
                    <td>{inventory.name}</td>
                    <td>{inventory.type}</td>
                    <td>{inventory.category}</td>
                    <td>{inventory.date}</td>
                    <td>
                      <span
                        style={{
                          color:
                            inventory.rquantity < 10 ? "red" : "inherit",
                        }}
                      >
                        {inventory.rquantity}
                      </span>
                      {inventory.rquantity < 10 && (
                        <span className="badge bg-danger">Low Stock</span>
                      )}
                    </td>
                    <td>{inventory.totalPrice}</td>
                    <td>
                      <Link to={`/UpdateProduct/${inventory._id}`}>
                        <button className="btn btn-primary">Edit</button>
                      </Link>
                      <button
                        onClick={(e) =>
                          handleDelete(inventory._id, inventory.name)
                        }
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
