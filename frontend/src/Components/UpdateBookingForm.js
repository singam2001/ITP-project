// import React, { useState } from 'react';
// import axios from 'axios';

// const UpdateBookingForm = ({ booking, onBookingUpdate, onCancel }) => {
//   const [mobileNo, setMobileNo] = useState(booking.Mobile_No);
//   const [dateValidity, setDateValidity] = useState(booking.dateValidity);
//   const [message, setMessage] = useState(booking.Message);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     switch (name) {
//       case 'Mobile_No':
//         setMobileNo(value);
//         break;
//       case 'dateValidity':
//         setDateValidity(value);
//         break;
//       case 'Message':
//         setMessage(value);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const updatedBooking = { ...booking, Mobile_No: mobileNo, dateValidity: dateValidity, Message: message };
//     onBookingUpdate(updatedBooking); // Call the onBookingUpdate function with the updated booking data
//   };
  

//   return (
//     <div className="update-booking-form">
//       <h3>Update Booking</h3>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="mobileNo">Mobile No:</label>
//         <input type="text" name="Mobile_No" id="mobileNo" value={mobileNo} onChange={handleInputChange} />
//         <label htmlFor="dateValidity">Date:</label>
//         <input type="date" name="dateValidity" id="dateValidity" value={dateValidity} onChange={handleInputChange} />
//         <label htmlFor="message">Message:</label>
//         <textarea name="message" id="message" value={message} onChange={handleInputChange} />
//         <button type="submit">Save</button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default UpdateBookingForm;
