import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProductDetails'


const ProductsPage = ({ data, getSafeArray }) => {
    const products = getSafeArray(data, 'Products');
    const navigate = useNavigate();

    // onClick handler to navigate to product details page
    const handleClick = () => {
    // You can run any logic here
    navigate('/productdetails');
  };

    return (
        <div className="page-container">
            <div className="content-card">
                <h1 className="main-heading">
                    Our <span className="highlight-text-pink">Products</span>
                </h1>
                <p className="sub-heading">
                    Explore our range of high-quality products designed to meet your needs.
                </p>

                <div className="grid-3-cols">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="product-card">
                                <img
                                    src={product.imageUrl || 'https://placehold.co/400x300/EFEFEF/333333?text=Product+Image'}
                                    alt={product.productName}
                                    className="product-img"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/400x300/EFEFEF/333333?text=Image+Not+Found';
                                    }}
                                />
                                <div className="product-details">
                                    <h3 className="product-name">{product.productName}</h3>
                                    {product.price && <p className="product-price">Price: {product.price}</p>}
                                    {product.description && <p className="product-description">{product.description}</p>}
                                   
                                    <button
                                       onClick={handleClick}
                                        className="product-button"
                                    >
                                        Know More
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">No products available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;