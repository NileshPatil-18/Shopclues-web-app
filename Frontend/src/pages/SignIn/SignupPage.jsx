import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authSlice';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = "http://localhost:8080/api/register";

const SignupPage = () => {
  const [userdata, setuserData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setuserData({ ...userdata, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (userdata.password !== userdata.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        name: userdata.name,
        email: userdata.email,
        mobile: userdata.mobile,
        password: userdata.password,
      });

      toast.success("User registered successfully");
      dispatch(registerUser({ name: userdata.name, email: userdata.email }));
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={userdata.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={userdata.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              placeholder="Enter mobile number"
              value={userdata.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={userdata.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm password"
              value={userdata.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <p className="text-center mt-3">Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;