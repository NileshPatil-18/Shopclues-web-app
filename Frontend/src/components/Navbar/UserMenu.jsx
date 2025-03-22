import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false); // Close dropdown after logoutUser
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
        {user?.user?.username}
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
              <h6 className="m-0">{user?.user?.username || "User"}</h6>
              <small className="text-muted">{user?.user?.email}</small>
            </div>
          </div>

          {/* Menu Links */}
          <ul className="list-unstyled mt-2">
            <li>
              <Link to="/orders" className="dropdown-item py-2">
                📦 My Orders
              </Link>
            </li>
            <li>
              <Link to="/address" className="dropdown-item py-2">
                🏠 Address
              </Link>
            </li>
            <li>
              <Link to="/profile" className="dropdown-item py-2">
              <FaUserCircle/> MyProfile
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          <button
            className="btn btn-danger w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
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
