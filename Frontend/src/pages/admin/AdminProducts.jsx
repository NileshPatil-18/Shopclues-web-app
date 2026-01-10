import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct } from '../../redux/slices/adminSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAdminProducts({ page: currentPage, limit: 10 }));
    }, [dispatch, currentPage]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success("Product deleted successfully");
            } catch (error) {
                toast.error(error || "Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <Link to="/admin/products/add" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    Add New Product
                </Link>
            </div>

            {/* Search Bar */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td>
                                                <strong>{product.name}</strong>
                                                <br />
                                                <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                                            </td>
                                            <td>{product.category?.name || 'Uncategorized'}</td>
                                            <td>₹{product.price}</td>
                                            <td>
                                                <span className={`badge ${product.stock > 10 ? 'bg-success' : 'bg-warning'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <Link
                                                        to={`/admin/products/edit/${product._id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        <FaTrash />
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

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        <li className="page-item">
                            <span className="page-link">Page {currentPage}</span>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={products.length < 10}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminProducts;