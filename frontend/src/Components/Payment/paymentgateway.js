import React, { useState, useEffect } from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


export default function Payment() {
    const [payment_id, setPaymentId] = useState("");
    const [cash, setCash] = useState("");
    const [bank, setBank] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [pays, setPays] = useState([]);
    const [apiurl, setApiUrl] = useState("http://localhost:8070/payment");

    

    const handleSubmit = () => {
        if (payment_id.trim() !== '' && cash.trim() !== '' && bank.trim() !== '' && date.trim() !== '') {
            if (!/^\d+$/.test(payment_id)) {
                setError("Payment ID must be a number");
                return;
            }
            if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(cash)) {
                setError("Cash must be a valid amount in rupees");
                return;
            }
            const formData = new FormData();
            formData.append('payment_id', payment_id);
            formData.append('cash', cash);
            formData.append('bank', bank);
            formData.append('date', date);
            formData.append('image', image);

            fetch(apiurl + "/create", {
                method: "POST",
                body: formData
            }).then((res) => {
                if (res.ok) {
                    setPays([...pays, { payment_id, cash, bank, date, image }]);
                    setMessage("Payment success");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to create item");
                }
            });
        } else {
            setError("All fields are required");
        }
    };

   
      
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        
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
   

   
      

    return (
        
        <div>
           
            <div className="row">
                <h3 className="text-center">Add payment</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group gap-2">
                    <input placeholder="Payment ID" value={payment_id} onChange={(e) => setPaymentId(e.target.value)} className="form-control" type="text" />
                    <input placeholder="Cash (in rupees)" value={cash} onChange={(e) => setCash(e.target.value)} className="form-control" type="text" />
                    <input placeholder="Bank" value={bank} onChange={(e) => setBank(e.target.value)} className="form-control" type="text" />
                    <input placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" type="date" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
       
    );
}
