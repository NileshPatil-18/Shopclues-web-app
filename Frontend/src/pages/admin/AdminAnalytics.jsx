import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderAnalytics } from '../../redux/slices/adminSlice';
import { FaChartLine, FaMoneyBillWave, FaShoppingCart, FaBox } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AdminAnalytics = () => {
    const dispatch = useDispatch();
    const { analytics, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getOrderAnalytics());
    }, [dispatch]);

    // Prepare chart data
    const revenueChartData = {
        labels: analytics.monthlyRevenue?.map(m => `${m._id.year}-${m._id.month}`) || [],
        datasets: [{
            label: 'Revenue',
            data: analytics.monthlyRevenue?.map(m => m.revenue) || [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
    };

    const statusChartData = {
        labels: analytics.statusCounts?.map(s => s._id) || [],
        datasets: [{
            data: analytics.statusCounts?.map(s => s.count) || [],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ]
        }]
    };

    return (
        <div>
            <h2 className="mb-4">Analytics Dashboard</h2>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Revenue</h6>
                                    <h3>₹{analytics.totalRevenue?.toLocaleString() || 0}</h3>
                                </div>
                                <div className="bg-primary text-white p-3 rounded">
                                    <FaMoneyBillWave size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted">Total Orders</h6>
                                    <h3>{analytics.totalOrders || 0}</h3>
                                </div>
                                <div className="bg-success text-white p-3 rounded">
                                    <FaShoppingCart size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Monthly Revenue</h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <Line data={revenueChartData} options={{ responsive: true }} />
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Orders by Status</h5>
                        </div>
                        <div className="card-body">
                            <Pie data={statusChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;