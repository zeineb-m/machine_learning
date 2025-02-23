import React, { useState } from 'react';
import './LoginSignup.css'; // Import the same CSS for styling
import axios from 'axios'; // Import axios for making API requests

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // State to hold success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage(response.data.message); // Set success message
    } catch (error) {
      setMessage(error.response?.data.message || "An error occurred"); // Set error message
    }
  };

  return (
    <div className="login-signup">
      <div className="form-box forgot-password">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: "#B6D7A8", width: "50%" }}>
            Send Reset Link
          </button>
          {message && <p className="message">{message}</p>} {/* Display message */}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 