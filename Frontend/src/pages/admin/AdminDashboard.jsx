import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        // Fetch dashboard stats (you'll implement API later)
        setStats({
            totalProducts: 150,
            totalOrders: 45,
            totalUsers: 89,
            totalRevenue: 125000
        });
    }, []);

    return (
        <div>
            <h2 className="mb-4">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Products</h6>
                                    <h3>{stats.totalProducts}</h3>
                                </div>
                                <div className="bg-primary text-white p-3 rounded">
                                    <FaBox size={24} />
                                </div>
                            </div>
                            <Link to="/admin/products" className="small">View All →</Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Orders</h6>
                                    <h3>{stats.totalOrders}</h3>
                                </div>
                                <div className="bg-success text-white p-3 rounded">
                                    <FaShoppingCart size={24} />
                                </div>
                            </div>
                            <Link to="/admin/orders" className="small">View All →</Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="card border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Users</h6>
                                    <h3>{stats.totalUsers}</h3>
                                </div>
                                <div className="bg-warning text-white p-3 rounded">
                                    <FaUsers size={24} />
                                </div>
                            </div>
                            <Link to="/admin/users" className="small">View All →</Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Revenue</h6>
                                    <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                                </div>
                                <div className="bg-info text-white p-3 rounded">
                                    <FaRupeeSign size={24} />
                                </div>
                            </div>
                            <Link to="/admin/analytics" className="small">View Details →</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <Link to="/admin/products/add" className="btn btn-primary w-100">
                                <FaBox className="me-2" />
                                Add New Product
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/admin/orders" className="btn btn-success w-100">
                                <FaShoppingCart className="me-2" />
                                Manage Orders
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link to="/admin/users" className="btn btn-warning w-100">
                                <FaUsers className="me-2" />
                                View Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;