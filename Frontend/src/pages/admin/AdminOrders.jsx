import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatus } from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
import { FaEye, FaCheck } from 'react-icons/fa';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.admin);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        dispatch(fetchAdminOrders({ status: statusFilter }));
    }, [dispatch, statusFilter]);

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await dispatch(updateOrderStatus({ orderId, status })).unwrap();
            toast.success("Order status updated");
        } catch (error) {
            toast.error(error || "Failed to update status");
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'Pending': 'warning',
            'Processing': 'info',
            'Shipped': 'primary',
            'Delivered': 'success',
            'Cancelled': 'danger'
        };
        return `bg-${statusColors[status]}`;
    };

    return (
        <div>
            <h2 className="mb-4">Order Management</h2>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label">Filter by Status</label>
                            <select 
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Orders</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id.slice(-6)}</td>
                                            <td>{order.userId?.name}<br/>
                                                <small>{order.userId?.email}</small>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.items.length} items</td>
                                            <td>₹{order.totalPrice}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <select 
                                                        className="form-select form-select-sm"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    <button className="btn btn-sm btn-outline-info ms-2">
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;