import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaTrash } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users from API
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Replace with your API call
            // const response = await api.get('/admin/users');
            // setUsers(response.data);
            
            // Mock data
            setUsers([
                { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2024-01-01' },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', createdAt: '2024-01-02' },
            ]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">User Management</h2>
            
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
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                                                        <FaUser />
                                                    </div>
                                                    <div>
                                                        <strong>{user.name}</strong><br/>
                                                        <small className="text-muted">ID: {user._id.slice(-6)}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <FaEnvelope className="me-2" />
                                                {user.email}
                                            </td>
                                            <td>
                                                <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <FaCalendar className="me-2" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger">
                                                    <FaTrash />
                                                </button>
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

export default AdminUsers;