import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetails = ({ data, getSafeArray }) => {
    const { id } = useParams();
    const products = getSafeArray(data, 'Products');
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="page-container">
                <div className="content-card">
                    <h1 className="main-heading">Product Not Found</h1>
                    <p className="sub-heading">
                        Sorry, the product you're looking for does not exist.
                    </p>
                    <Link to="/" className="product-button">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-card">
                <Link to="/" className="back-button">
                    ← Back to Products
                </Link>
                <h1 className="main-heading">{product.productName}</h1>
                <div className="product-details-container">
                    <img
                        src={product.imageUrl || 'https://placehold.co/600x400/EFEFEF/333333?text=Product+Image'}
                        alt={product.productName}
                        className="product-details-img"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/600x400/EFEFEF/333333?text=Image+Not+Found';
                        }}
                    />
                    <div className="product-info">
                        {product.price && (
                            <p className="product-price">
                                Price: {product.price}
                            </p>
                        )}
                        {product.description && (
                            <p className="product-description">
                                {product.description}
                            </p>
                        )}
                        {product.details?.fullDescription && (
                            <div className="full-description">
                                <h2 className="section-heading">Full Description</h2>
                                <p>{product.details.fullDescription}</p>
                            </div>
                        )}
                        {product.details?.specifications && (
                            <div className="specifications">
                                <h2 className="section-heading">Specifications</h2>
                                <ul>
                                    {product.details.specifications.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.details?.additionalInfo && (
                            <div className="additional-info">
                                <h2 className="section-heading">Additional Information</h2>
                                <p>{product.details.additionalInfo}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
};


export default ProductDetails;