import React, { useState } from 'react';
import axios from 'axios';

const SendEmailForm = ({ supplierId, supplierEmail }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8070/api/v1/suppliers/send-email`, {
        supplierId,
        subject,
        body
      });
      alert('Email sent successfully!');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again later.');
    }
  };

  return (
    <div>
      <h3>Send Email</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">Body</label>
          <textarea
            className="form-control"
            id="body"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send Email</button>
      </form>
    </div>
  );
};

export default SendEmailForm;
