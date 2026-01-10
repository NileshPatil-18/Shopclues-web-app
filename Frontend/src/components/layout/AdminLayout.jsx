import React from 'react';
import {Outlet,Link,useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect } from 'react';
import {toast} from 'react-toastify';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = ()=>{
    const navigate = useNavigate();
    const {user} = useSelector((state)=>state.auth);

    useEffect(()=>{
        if(!user || user.role !== 'admin'){
            toast.error("Access denied. Admin only.");
            navigate('/');
        }
    },[user,navigate]);

    const handleLogout = () =>{
        localStorage.clear();
        navigate("/login");
    };
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed">
                    <div className="sidebar-sticky pt-3">
                        <h3 className="text-center mb-4">
                            <span className="text-warning">ShopClues</span> Admin
                        </h3>
                        
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to="/admin/dashboard" className="nav-link text-white d-flex align-items-center">
                                    <FaTachometerAlt className="me-2" />
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/products" className="nav-link text-white d-flex align-items-center">
                                    <FaBox className="me-2" />
                                    Products
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/orders" className="nav-link text-white d-flex align-items-center">
                                    <FaShoppingCart className="me-2" />
                                    Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/users" className="nav-link text-white d-flex align-items-center">
                                    <FaUsers className="me-2" />
                                    Users
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/analytics" className="nav-link text-white d-flex align-items-center">
                                    <FaChartBar className="me-2" />
                                    Analytics
                                </Link>
                            </li>
                            <li className="nav-item mt-5">
                                <button 
                                    onClick={handleLogout}
                                    className="nav-link text-white d-flex align-items-center btn btn-link"
                                >
                                    <FaSignOutAlt className="me-2" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9 col-lg-10 ms-auto">
                    <nav className="navbar navbar-light bg-light border-bottom py-3">
                        <div className="container-fluid">
                            <h4 className="mb-0">Admin Dashboard</h4>
                            <div className="d-flex align-items-center">
                                <span className="me-3">Welcome, {user?.name}</span>
                                <span className="badge bg-success">Admin</span>
                            </div>
                        </div>
                    </nav>
                    
                    <main className="p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;