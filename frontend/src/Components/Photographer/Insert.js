import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from './Navbar';

function Insert() {
  const [input, setInput] = useState({
    F_name: '',
    L_name: '',
    images: [],
    Email: '',
    Phone: '',
    Address: '',
    isValidPhone: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.F_name || !input.L_name || input.images.length === 0 || !input.Email || !input.Phone || !input.Address) {
      Swal.fire({
        icon: 'error',
        title: 'PLEASE FILL ALL FIELDS',
        text: 'Please fill in all required fields before submitting the form',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('F_name', input.F_name);
      formData.append('L_name', input.L_name);
      input.images.forEach(image => {
        formData.append('images', image);
      });
      formData.append('Email', input.Email);
      formData.append('Phone', input.Phone);
      formData.append('Address', input.Address);

      await axios.post('http://localhost:8070/api/pho/sup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Photographer Successfully Added!',
        confirmButtonText: 'OK',
        onConfirm: () => {
          window.location.reload();
        },
      });

      setInput({
        F_name: '',
        L_name: '',
        images: [],
        Email: '',
        Phone: '',
        Address: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response ? error.response.data.message : 'An error occurred while processing your request',
      });
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    let isValidPhone = input.isValidPhone;
    if (name === 'Phone') {
      isValidPhone = value.length === 10;
    }
    setInput(prevFormData => ({
      ...prevFormData,
      [name]: value,
      isValidPhone: isValidPhone,
    }));
  };

  const handleImageChange = (event) => {
    const images = event.target.files;
    setInput(prevInput => ({
      ...prevInput,
      images: [...prevInput.images, ...images],
    }));
  };

  return (
    <div >
      <Navbar />
      <div className="container"  style={{ backgroundColor: "#E5E5E5" }}>
      <form className="con" onSubmit={handleSubmit}>
        <div className="row">
          <h2><b><center>ADD NEW PHOTOGRAPHER</center></b></h2><br />

          <div >
            <div className="mb-3 col-lg-6 col-md-6 col-12">
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
            <div className="mb-3 col-lg-6 col-md-6 col-12">
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
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="images">PHOTOGRAPHER PHOTO</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-control-file"
              />
            </div>

            {input.images.length > 0 && (
              <div>
                <h6>Selected Images:</h6>
                <ul>
                  {input.images.map((image, index) => (
                    <li key={index}>{image.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-3 col-lg-6 col-md-6 col-12">
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
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="exampleInputPassword1" className="form-label">PHONE</label>
              <input
                name="Phone"
                value={input.Phone}
                onChange={handleInputChange}
                type="text"
                className="form-control"
                id="exampleInputPassword1"
              />
              {!input.isValidPhone && (
                <span style={{ color: 'red' }}>Invalid Phone Number</span>
              )}
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
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
          </div>
        </div>

        <div className="my-3">
          <button type="submit" className="btn btn-success me-5">SUBMIT</button>
          <Link to={"/"}><button className="btn btn-danger">CANCEL</button></Link>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Insert;
