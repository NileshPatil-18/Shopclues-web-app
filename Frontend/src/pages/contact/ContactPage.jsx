import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactPage = () => {
  return (
    <div className="container mt-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
        </ol>
      </nav>

      {/* Contact Us Section */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">Contact Us</h1>
      </div>

      {/* Contact Info and Form */}
      <div className="row g-4">
        {/* Contact Details */}
        <div className="col-md-5">
          <div className="card shadow p-4">
            <h4 className="text-secondary">Headquarters & Registered Office</h4>
            <p className="mb-1">Clues Network Pvt. Ltd.</p>
            <p>1404-07, 14th Floor, Tower - B Unitech Cyber Park, Sector 39, Gurugram, Haryana - 122003</p>
            <h6 className="fw-bold">How to Reach</h6>
            <a href="https://maps.google.com" className="text-decoration-none text-primary">Get Directions Using Google Maps</a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-md-7">
          <div className="card shadow p-4">
            <h4 className="text-secondary">Get in Touch</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-control" placeholder="Enter your name" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Email</label>
                <input type="email" className="form-control" placeholder="Enter your email" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4" placeholder="Write your message here" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;