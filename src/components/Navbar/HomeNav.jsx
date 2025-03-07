import React from "react";
import { Nav_home } from "../../utils/constants";
import { Link } from "react-router-dom";

const HomeNav = () => {
  return (
    <nav className="bg-white w-100 shadow-sm">
      <div className="d-flex justify-content-center align-items-center gap-1  font-bold hover-text-green ">
        {Nav_home.map((link) => (
          <Link 
            to={link.path} 
            key={link.id} 
            className="text-decoration-none text-secondary px-3 rounded"
            style={{
              fontSize: "12px", 
              fontWeight: "normal", 
              padding: "5px 10px",
              transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "green";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "gray";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default HomeNav;
