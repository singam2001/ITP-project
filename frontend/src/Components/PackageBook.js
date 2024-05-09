import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Modal, Button } from 'react-bootstrap';
import { DateRange } from "react-date-range";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Footer from "./Footer";
import "./../Style/ListingDetails.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Header from "./Header.js";
import Payment from "./Payment/paymentgateway.js"; 

function ListingDetails() {
  const { albumId } = useParams();
  const navigate = useNavigate(); // Import and use useNavigate hook
  const [albumData, setAlbumData] = useState({ Package_Name: '', Amount: '', Description: '' });
  const [photos, setPhotos] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Mobile_No, setMobile] = useState('');
  const [dateValidity, setDate] = useState('');
  const [Message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (albumId) {
      axios.get(`http://localhost:8070/packagesweb/get/${albumId}`)
        .then((response) => {
          setAlbumData(response.data.album);
          setPhotos(response.data.album.images);
        })
        .catch((error) => {
          console.error('Error fetching album data and photos:', error);
        });
    }
  }, [albumId]);
  
  const handleFeedbackModalOpen = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
  };

  const handleSelect = (ranges) => {
    const selectedStartDate = ranges.selection.startDate;
    const today = new Date();

    if (selectedStartDate < today) {
      alert("Please select a future date for booking.");
    } else {
      setDateRange([ranges.selection]);
      setDate(selectedStartDate.toISOString().split('T')[0]);
    }
  };

  const onToken = (token) => {
    console.log(token);
    setPaymentCompleted(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isDateAvailable = await checkDateAvailability();

    if (!isDateAvailable) {
      setError('This date is already booked. Please choose another date.');
      return;
    }

    const detail = {
      Name,
      Email,
      Mobile_No,
      dateValidity,
      Message,
      Package_Name: albumData?.Package_Name
    };

    try {
      const response = await axios.post('http://localhost:8070/Bookingdetail/addDetails', detail);
      if (response && response.status === 200) {
        setName('');
        setEmail('');
        setMobile('');
        setDate('');
        setMessage('');
        setAlbumData('');
        setError(null);
        console.log('Detail added', response.data);
        //alert('Detail added successfully!');
       
      } else {
        console.error('Invalid response received:', response);
        setError('An error occurred while adding detail');
      }
    } catch (error) {
      console.error('Error adding detail:', error);
      setError('An error occurred while adding detail');
    }
  };

  const checkDateAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/Bookingdetail/checkAvailability/${dateValidity}`);
      return !response.data.exists;
    } catch (error) {
      console.error('Error checking date availability:', error);
      return true;
    }
  };



  const backgroundStyle = {
    backgroundImage: `url('/path/to/background/image.jpg')`,
    justifyContent: "space-between",
    backgroundSize: "cover",
    backgroundRepeat: 'no-repeat',
    height: "auto",
    textAlign: "center", 
    justifyContent: "space-between",
    alignItems: "center", 
    minHeight: "100vh", 
    backgroundSize: "cover",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', 
    filter: "brightness(0.9)",
    backgroundColor:"#DECFBE", 
  };

  const containerStyle = {
    marginTop:'30px',
    marginBottom: '100px',
    width: '500px',
    margin: "0 auto", 
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "15px",
  };

  const buttonStyle = {
    width: "150px",
    padding: "10px",
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "15px",
  };

  return (
    <>
    <Header/>
      <div className="listing-details" style={backgroundStyle}>
        <div className="title">
          <h3>{albumData.Package_Name}</h3>
          <div></div>
        </div>

        <div className="row">
          {photos.map((photo) => (
            <div className="col-md-3" key={photo.filename}>
              <div className="card mb-3 shadow-sm">
                <img
                  src={`http://localhost:8070/uploads/${photo.filename}`}
                  alt={photo.filename}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h3>Description</h3>
        <p>{albumData.Description}</p>
        <hr />

        <h3>Amount</h3>
        <p>{albumData.Amount}</p>
        <hr />

        <div style={containerStyle}>
          <form style={formStyle} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nameInput">Your Name :</label>
              <input
                type="text"
                id="nameInput"
                placeholder="Enter Your Name"
                value={Name}
                onChange={(event) => setName(event.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailInput">Email :</label>
              <input
                type="email"
                placeholder="Enter email"
                id="emailInput"
                value={Email}
                onChange={(event) => setEmail(event.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobileInput">Mobile No :</label>
              <input
                type="number"
                placeholder="Enter the Mobile Number"
                id="mobileInput"
                value={Mobile_No}
                onChange={(event) => setMobile(event.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <h2>What's the date you select?</h2>
              <div className="date-range-calendar">
                <DateRange ranges={dateRange} onChange={handleSelect} />
                <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="messageInput">Message :</label>
              <input
                type="text"
                placeholder="Enter Your Message"
                id="messageInput"
                value={Message}
                onChange={(event) => setMessage(event.target.value)}
                style={inputStyle}
              />
            </div>

            <h2>Total price: {albumData.Amount}</h2>

            {error && <div style={errorStyle}>{error}</div>}

            <div className="text-center">
              <button type="submit" style={buttonStyle} >BOOK</button>
              <Button variant="primary" type="submit" style={buttonStyle}  onClick={handleFeedbackModalOpen}>PAY</Button>
              <Modal show={showFeedbackModal} onHide={handleFeedbackModalClose}>
                   <Modal.Header closeButton>
                      <Modal.Title>Payment Gateway</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                    <Payment />
                   </Modal.Body>
                  </Modal> 
             {/* <StripeCheckout
              token={onToken}
              name="Payment"
              dollar="American dollar"
              amount={albumData.Amount}
              stripeKey="pk_test_51OpqqFSBzKYeZJJOwl3Rhr9O2Jssm5c9Lbm20s1skmQka0a6keQHpZKJGrfWZi1KnmlwwWh3ZaKIIJzbSxRe60ie00nIsIcJIc"
            /> */}
            </div>
          </form>
        </div>

        
      </div>

      <Footer />
    </>
  );
}

export default ListingDetails;
