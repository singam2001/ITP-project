import React, { useState, useEffect } from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ViewPayment() {
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(-1);
    const [message, setMessage] = useState("");
    const [editPaymentId, setEditPaymentId] = useState("");
    const [editCash, setEditCash] = useState("");
    const [editBank, setEditBank] = useState("");
    const [editDate, setEditDate] = useState("");
    const [pays, setPays] = useState([]);
    // const [image, setImage] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [apiurl, setApiUrl] = useState("http://localhost:8070/payment");
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    

    const handleUpdateEditCancel = () => {
        setEditId(-1);
        setEditPaymentId("");
        setEditCash("");
        setEditBank("");
        setEditDate("");
        setEditImage(null); // Reset edited image
    };

    const handleUpdate = (id) => {
        const updatedPayment = {
            payment_id: editPaymentId,
            cash: editCash,
            bank: editBank,
            date: editDate,
            image: editImage // Add image to the updatedPayment object
        };
    
        fetch(apiurl + "/update/" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPayment) // Stringify the updatedPayment object
        }).then((res) => {
            if (res.ok) {
                setPays(pays.map((item) => {
                    if (item._id === id) {
                        return { ...item, payment_id: editPaymentId, cash: editCash, bank: editBank, date: editDate, image: editImage };
                    } else {
                        return item;
                    }
                }));
                setMessage("Payment updated successfully");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
                setSelectedImage(editImage); // Update selectedImage state
                handleUpdateEditCancel(); // Call handleUpdateEditCancel after successful update
            } else {
                setError("Unable to update payment");
            }
        }).catch(error => {
            console.error("Error updating payment:", error);
            setError("Unable to update payment");
        });
    };
    

    const handleDelete = (id) => {
        fetch(apiurl + "/delete/" + id, {
            method: "DELETE"
        }).then((res) => {
            if (res.ok) {
                setPays(pays.filter((item) => item._id !== id));
                setMessage("Payment deleted successfully");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                setError("Unable to delete payment");
            }
        });
    };
    

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditPaymentId(item.payment_id);
        setEditCash(item.cash);
        setEditBank(item.bank);
        setEditDate(item.date);
        setEditImage(item.image);
    };

    const handleEditCancel = () => {
        setEditId(-1);
        setEditPaymentId("");
        setEditCash("");
        setEditBank("");
        setEditDate("");
        setEditImage(null); // Reset edited image
    };

    useEffect(() => {
        const getItems = () => {
            fetch(apiurl + "/get")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((res) => {
                    setPays(res);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        };

        getItems();
    }, []);
    useEffect(() => {
        const results = pays.filter(pay =>
            pay.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPays(results);
    }, [searchTerm]);

    const handleGeneratePdf = () => {
        // initialize the PDF document
        const doc = new jsPDF();
        // add title to the PDF document
        doc.setFontSize(16);
        doc.text('Payment Report', 14, 22);
        // define the table columns
        const columns = [    
            { header: 'PAYMENT_ID', dataKey: 'payment_id' },    
            { header: 'CASH', dataKey: 'cash' },    
            { header: 'BANK', dataKey: 'bank' },    
            { header: 'DATE', dataKey: 'date' },      
        ];
        // define the table rows
        const rows = pays.map(item => ({
            payment_id: item.payment_id.substr(0,10),
            cash: item.cash,
            bank: item.bank,
            date: item.date, 
        }));
        
        // add the table to the PDF document
        doc.autoTable(columns, rows);
        
        // save the PDF file
        doc.save('Payment.pdf');
    };
      

    return (
        <div>
            <div className="Buttonsdiv">
                <button className="secondary__btn" id="btn_position" onClick={handleGeneratePdf}>Generate Feedback Report</button>
            </div>

            <div className="row mt-3">
                <h3 className="text-center text-primary">PAYMENTS LISTINGS</h3>
                <input
                    type="text"
                    placeholder="Search payment ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
               
                <ul className="list-group">
                    {pays.map((item) => (
                        <li key={item._id} className="list-group-item d-flex justify-content-between bg-info align-items-center my-2">
                            <div className="d-flex flex-column">
                                {editId !== item._id ? (
                                    <>
                                        <span className="fw-bold">{item.payment_id}</span>
                                        <span className="fw-bold">{item.cash}</span>
                                        <span className="fw-bold">{item.bank}</span>
                                        <span className="fw-bold">{item.date}</span>
                                        {item.image && (
                                            <img
                                                src={`${apiurl}/uploads/${item.image}`}
                                                alt="Payment"
                                                className="img-fluid mt-2"
                                                onClick={() => {
                                                    setSelectedImage(item.image);
                                                    setIsLightboxOpen(true);
                                                }}
                                            />
                                        )}
                                        {!item.image && (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <input placeholder="payment id" value={editPaymentId} onChange={(e) => setEditPaymentId(e.target.value)} className="form-control" type="text" />
                                        <input placeholder="cash" value={editCash} onChange={(e) => setEditCash(e.target.value)} className="form-control" type="text" />
                                        <input placeholder="bank" value={editBank} onChange={(e) => setEditBank(e.target.value)} className="form-control" type="text" />
                                        <input placeholder="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="form-control" type="date" />
                                        <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} className="form-control" />
                                    </>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                {editId !== item._id ? (
                                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleUpdate(item._id)}>Update</button>
                                )}
                                {editId !== item._id ? (
                                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                ) : (
                                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <Lightbox
                    mainSrc={`${apiurl}/uploads/${selectedImage}`}
                    onCloseRequest={() => setIsLightboxOpen(false)}
                />
            )}
        </div>
    );
}
