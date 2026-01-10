import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaShieldAlt, FaBox, FaMapMarkerAlt } from "react-icons/fa";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <div className="position-relative">
      {/* User Profile Button */}
      <button
        className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 rounded shadow-sm"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ fontWeight: "500", transition: "0.3s" }}
      >
        <FaUserCircle className="me-1" size={22} />
        {user?.name || "User"}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          className="position-absolute bg-white shadow-lg rounded p-3 mt-2"
          style={{
            right: 0,
            top: "100%",
            minWidth: "240px",
            zIndex: 1000,
            borderRadius: "10px",
          }}
        >
          {/* Card Header */}
          <div className="d-flex align-items-center gap-2 border-bottom pb-2">
            <FaUserCircle size={28} className="text-primary" />
            <div>
              <h6 className="m-0">{user?.name || "User"}</h6>
              <small className="text-muted">{user?.email}</small>
              {user?.role === 'admin' && (
                <span className="badge bg-warning text-dark ms-2">Admin</span>
              )}
            </div>
          </div>

          {/* Menu Links */}
          <ul className="list-unstyled mt-2">
            <li>
              <Link 
                to="/orders" 
                className="dropdown-item py-2 d-flex align-items-center"
                onClick={() => setShowDropdown(false)}
              >
                <FaBox className="me-2" />
                My Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/address" 
                className="dropdown-item py-2 d-flex align-items-center"
                onClick={() => setShowDropdown(false)}
              >
                <FaMapMarkerAlt className="me-2" />
                Address
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className="dropdown-item py-2 d-flex align-items-center"
                onClick={() => setShowDropdown(false)}
              >
                <FaUserCircle className="me-2" />
                My Profile
              </Link>
            </li>
            
            {/* ADMIN DASHBOARD LINK */}
            {user?.role === 'admin' && (
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className="dropdown-item py-2 d-flex align-items-center text-warning"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaShieldAlt className="me-2" />
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Divider */}
          <hr className="my-2" />

          {/* Logout Button */}
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;