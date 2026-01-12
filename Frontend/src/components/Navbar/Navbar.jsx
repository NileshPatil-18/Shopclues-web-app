import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaHeart, FaShoppingCart, FaBell, FaSearchLocation, FaUserCircle, FaBars, FaShieldAlt } from "react-icons/fa";
import { Main_Nav, Nav_1 } from "../../utils/constants";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";
import UserMenu from "./UserMenu";
import Search from "../Search/Search";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-light py-2 d-none d-md-block">
        <div className="container d-flex flex-wrap justify-content-end gap-2">
          {Nav_1.map((link) => (
            <Link to={link.path} key={link.id} className="text-dark text-decoration-none small px-2">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              alt="Logo"
              style={{ height: "40px", width: "180px", objectFit: "contain" }}
            />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars className="fs-4" />
          </button>

          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            <div className="d-flex mx-auto my-3 my-lg-0 w-100 w-lg-50 ms-lg-3 me-lg-3">
              <Search />
            </div>

            <div className="d-flex flex-column flex-lg-row align-items-center gap-3 ms-lg-auto mt-3 mt-lg-0">
              {/* Location */}
              <Link to="/location" className="text-dark fs-5 d-flex align-items-center gap-1">
                <FaSearchLocation />
              </Link>

              {/* Notifications */}
              <Link to="/notifications" className="text-dark fs-5 d-flex align-items-center gap-1">
                <FaBell />
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="text-dark fs-5 d-flex align-items-center gap-1">
                <FaHeart />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="text-dark fs-5 d-flex align-items-center gap-1 position-relative">
                <FaShoppingCart />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  0
                </span>
              </Link>

              {/* ADMIN DASHBOARD LINK - Visible only for admin users */}
              {isLoggedIn && user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className="text-dark fs-5 d-flex align-items-center gap-1"
                  title="Admin Dashboard"
                >
                  <FaShieldAlt />
                  <span className="d-none d-lg-inline">Admin</span>
                </Link>
              )}

              {/* User Menu or Auth Buttons */}
              {isLoggedIn ? (
                <UserMenu />
              ) : (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100 w-lg-auto mt-2 mt-lg-0">
                  <Link to="/signup" className="btn btn-outline-primary btn-sm w-100 w-lg-auto">
                    SignUp
                  </Link>
                  <Link to="/login" className="btn btn-primary btn-sm w-100 w-lg-auto">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-info py-1">
        <div className="container">
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#categoryNav"
            aria-controls="categoryNav"
            aria-expanded="false"
            aria-label="Toggle categories"
          >
            <span className="navbar-toggler-icon"></span>
            <span className="ms-2 text-white">Categories</span>
          </button>

          <div className="collapse navbar-collapse" id="categoryNav">
            <div className="navbar-nav d-flex flex-wrap justify-content-center justify-content-lg-start w-100">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    to={`/category/${category._id}`}
                    key={category._id}
                    className="nav-link text-white px-3 py-2 text-nowrap"
                  >
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </Link>
                ))
              ) : (
                <span className="nav-link text-white">Loading categories...</span>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;