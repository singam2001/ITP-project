import React, { useState } from "react";
import { FaMailBulk, FaUserAlt } from 'react-icons/fa';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import './Feedbackform.css';

const API_URL = 'http://localhost:8070/api/CustomerAffairs';

const ServiceFeedbackform = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(API_URL, {
                userId: "45821463#23669545",
                name: name,
                email: email,
                rating: rating,
                feedback: feedback
            });
            
            window.alert('Feedback has been submitted successfully');
            window.location.reload();
            console.log('Successfully added to list');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bgimg " >
            <section className="feedbacksection">
                <h1 className="title">Give Your Feedback</h1>
                <form onSubmit={handleSubmit}>
                <div className="feedbackcontainer" >
    <div className="feedbackid mb-3">
        <input className="form-control my-input" type="text" placeholder="Full name" onChange={(event) => setName(event.target.value)} value={name} required />
        <FaUserAlt className="user" />
    </div>
    <div className="feedbackid mb-3">
        <input className="form-control my-input" type="email" placeholder="Email Address" onChange={(event) => setEmail(event.target.value)} value={email} required />
        <FaMailBulk className="mail" />
    </div>
    <div className="mb-3">
        <label className="servicerate d-block">Rate our service</label>
        <div>
            {Array(5).fill().map((_, index) =>
                <span key={index} className="star-icon">
                    {rating >= index + 1 ?
                        <AiFillStar style={{ color: 'orange' }} onClick={() => setRating(index + 1)} className="FillStar" />
                        :
                        <AiOutlineStar style={{ color: 'orange' }} onClick={() => setRating(index + 1)} className="OutlineStar" />
                    }
                </span>
            )}
        </div>
    </div>
    <textarea cols="45" rows="5" placeholder="Enter your opinions here.." className="form-control serviceText mb-3" onChange={(event) => setFeedback(event.target.value)} value={feedback} required></textarea>
    <button className="btn btn-primary me-3" style={{ backgroundColor: '#053F5C', color: 'white' }}type="submit">Submit</button>
    <button className="btn btn-secondary" style={{ backgroundColor: '#053F5C', color: 'white' }} type="reset">Cancel</button>
</div>

                </form>
            </section>
        </div>
    );
}

export default ServiceFeedbackform;
