import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct, updateProduct } from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';

const AddEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, loading: adminLoading, error } = useSelector((state) => state.admin);
    const { categories } = useSelector((state) => state.categories);
    
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        brand: '',
        stock: 100
    });
    
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // If edit mode, load product data
    useEffect(() => {
        if (isEditMode) {
            const product = products.find(p => p._id === id);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    category: product.category?._id || product.category || '',
                    image: product.image,
                    brand: product.brand || '',
                    stock: product.stock || 100
                });
            } else {
                toast.error("Product not found");
                navigate('/admin/products');
            }
        }
    }, [id, isEditMode, products, navigate]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) errors.name = "Product name is required";
        if (!formData.price || formData.price <= 0) errors.price = "Valid price is required";
        if (!formData.category) errors.category = "Category is required";
        if (!formData.image.trim()) errors.image = "Image URL is required";
        if (!formData.brand.trim()) errors.brand = "Brand is required";
        if (!formData.stock || formData.stock < 0) errors.stock = "Valid stock quantity is required";
        
        // URL validation for image
        try {
            new URL(formData.image);
        } catch {
            if (formData.image.trim() && !formData.image.startsWith('data:image')) {
                errors.image = "Please enter a valid image URL";
            }
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix validation errors");
            return;
        }

        setLoading(true);
        
        try {
            if (isEditMode) {
                await dispatch(updateProduct({ id, productData: formData })).unwrap();
                toast.success("Product updated successfully");
            } else {
                await dispatch(createProduct(formData)).unwrap();
                toast.success("Product created successfully");
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error?.message || error || "Operation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/products');
    };

    if (adminLoading && isEditMode) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter product name"
                                disabled={loading}
                            />
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter product description"
                                disabled={loading}
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                                disabled={loading}
                            />
                            {validationErrors.price && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading || !categories.length}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.category && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand *
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.brand ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter brand name"
                                disabled={loading}
                            />
                            {validationErrors.brand && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.brand}</p>
                            )}
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.stock ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter stock quantity"
                                disabled={loading}
                            />
                            {validationErrors.stock && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.stock}</p>
                            )}
                        </div>

                        {/* Image URL */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL *
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    validationErrors.image ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter image URL"
                                disabled={loading}
                            />
                            {validationErrors.image && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                            )}
                        </div>

                        {/* Image Preview */}
                        {formData.image && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Preview
                                </label>
                                <div className="border border-gray-300 rounded-lg p-2">
                                    <img
                                        src={formData.image}
                                        alt="Product preview"
                                        className="h-48 object-contain mx-auto"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* File Upload Alternative */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Or Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Upload an image file (JPG, PNG, GIF)
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isEditMode ? 'Update Product' : 'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Display Redux error if any */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AddEditProduct;