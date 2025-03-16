import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaRupeeSign, FaShieldAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light pt-4">
      {/* Top Section */}
      <div className="container text-center pb-3 border-bottom">
        <div className="row">
          <div className="col-md-4">
            <FaShieldAlt size={40} className="text-primary" />
            <p className="mt-2 fw-bold">Great Selection</p>
          </div>
          <div className="col-md-4">
            <FaRupeeSign size={40} className="text-primary" />
            <p className="mt-2 fw-bold">Low Price</p>
          </div>
          <div className="col-md-4">
            <FaShoppingCart size={40} className="text-primary" />
            <p className="mt-2 fw-bold">Speedy Delivery</p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mt-4">
        <div className="row text-start">
          {/* Shopper Central */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Shopper Central</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-dark text-decoration-none">Easy Returns & Replacement</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Sign In/Register</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Our Policies</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">CluesBucks</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Payment Options</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">ShopClues Surety</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">FAQs (Help)</Link></li>
            </ul>
          </div>

          {/* Merchant Central */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Merchant Central</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-dark text-decoration-none">Merchant Panel</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">How To Sell</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Commission Structure</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Fulfillment Policy</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Policies & Rules</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">About Us</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-dark text-decoration-none">History</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Band of Trust</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Awards</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Careers</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Contact Us</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-dark text-decoration-none">Merchant Support</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Bulk Orders</Link></li>
              <li><Link to="#" className="text-dark text-decoration-none">Press</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{ bottom: "20px", right: "20px", width: "45px", height: "45px" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
