import React, { useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from './Navbar';

function Insert() {
    const [input, setInput] = useState({
        F_name: "",
        L_name: "",
        Email: "",
        Phone: "",
        Address: "",
        Products: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        for (const field in input) {
            if (!input[field]) {
                Swal.fire({
                    icon: 'error',
                    title: 'PLEASE FILL ALL FIELDS',
                    text: 'Please fill in all required fields before submitting the form.',
                });
                return;
            }
        }

        // Check if the email format is valid
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.Email)) {
            Swal.fire({
                icon: 'error',
                title: 'INVALID EMAIL',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        // Check if the phone number format is valid
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(input.Phone)) {
            Swal.fire({
                icon: 'error',
                title: 'INVALID PHONE NUMBER',
                text: 'Please enter a 10-digit phone number.',
            });
            return;
        }

        // If all validations pass, proceed to submit the form
        try {
            await axios.post("http://localhost:8070/api/v1/sup", input);
            Swal.fire({
                icon: "success",
                title: "Supplier Successfully Added!",
                confirmButtonText: "OK",
                onConfirm: () => {
                    // Optionally add any action here after confirming
                },
            });
            setInput({
                F_name: "",
                L_name: "",
                Email: "",
                Phone: "",
                Address: "",
                Products: "",
            });
        } catch (error) {
            // Handle error from API request
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while adding the supplier. Please try again later.",
            });
        }
    };
    

    const handleInputChange = event => {
        let { name, value } = event.target;

        // Check if the input field being updated is the Phone field
        if (name === 'Phone') {
            // Ensure that the phone number starts with '0'
            if (value.length > 0 && value[0] !== '0') {
                // If it doesn't start with '0', prepend '0' to the value
                value = '0' + value;
            }
        }

        setInput(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '100px',
        borderRadius: '0.5rem',
        boxShadow: '0 0 0.25rem rgba(0, 0, 0, 0.1)',
    };

    const titleStyle = {
        marginBottom: '1rem',
        textAlign: 'center',
    };

    const rowStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:'left',
        width: '100%',
    };

    const inputStyle = {
        marginBottom: '10px',
    };

    return (
        <div>
            <Navbar/>
            <div className='container'>
                <form style={containerStyle} onSubmit={handleSubmit}>
                    <div style={rowStyle}>
                        <h2 style={titleStyle}><b><center>ADD NEW SUPPLIER</center></b></h2><br/><br/>
                        <div>
                            <br/>
                            <br/>
                            <center>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputEmail1" className="form-label">FIRST NAME</label>
                                    <input
                                        name="F_name"
                                        value={input.F_name}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                    />
                                </div>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputPassword1" className="form-label">LAST NAME</label>
                                    <input
                                        name="L_name"
                                        value={input.L_name}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputPassword1" className="form-label">EMAIL</label>
                                    <input
                                        name="Email"
                                        value={input.Email}
                                        onChange={handleInputChange}
                                        type="email"
                                        className="form-control"
                                        id="exampleNic"
                                    />
                                </div>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputPassword1" className="form-label">PHONE</label>
                                    <input
                                        name="Phone"
                                        value={input.Phone}
                                        onChange={handleInputChange}
                                        type="phone"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputPassword1" className="form-label">ADDRESS</label>
                                    <input
                                        name="Address"
                                        value={input.Address}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>
                                <div style={inputStyle}>
                                    <label htmlFor="exampleInputPassword1" className="form-label">PRODUCTS</label>
                                    <input
                                        name="Products"
                                        value={input.Products}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>
                            </center>
                        </div>
                    </div>
                    <div className="my-3">
                        <button type="submit" className="btn btn-success me-5">SUBMIT</button>
                        <Link to={"/supplierHome"}><button className='btn btn-danger'>CANCEL</button></Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Insert;
