import React from 'react';
import { ProductsIconSvg, SpecialtiesIconSvg } from './Icons';

const HomePage = ({ data, getSafeArray }) => {
    const businessInfo = data?.businessInfo;
    const images = getSafeArray(data, 'images');
    const mainImageUrl = images.length > 0 ? images[0].imageUrl : 'https://placehold.co/1200x400/CCCCCC/333333?text=Main+Image';

    return (
        <div className="page-container bg-gradient-purple-indigo margin-top-56">
            <div className="content-card">
                <h1 className="main-heading text-indigo-800">
                    Welcome to <span className="highlight-text-purple">{businessInfo?.businessName || 'Our Business'}</span>
                </h1>
                <p className="sub-heading text-gray-700">
                    {businessInfo?.AboutBusiness || 'Discover our services and see what makes us unique.'}
                </p>

                <div className="image-hero-container">
                    <img
                        src={mainImageUrl}
                        alt="Business Main"
                        className="image-cover hover-scale"
                        onError={(e) => { e.target.src = 'https://placehold.co/1200x400/CCCCCC/333333?text=Image+Not+Found'; }}
                    />
                    <div className="image-overlay">
                        <h2 className="image-overlay-text">
                            Innovative Solutions for Your Future
                        </h2>
                    </div>
                </div>

                <div className="grid-2-cols gap-6">
                    <div className="card-item bg-gradient-blue-light">
                        <h3 className="card-title text-blue-700"><ProductsIconSvg className="icon" /> Our Products</h3>
                        <p className="card-text">Explore our cutting-edge products designed to meet your needs and exceed expectations.</p>
                    </div>
                    <div className="card-item bg-gradient-green-light">
                        <h3 className="card-title text-green-700"><SpecialtiesIconSvg className="icon" /> Our Specialties</h3>
                        <p className="card-text">We specialize in delivering top-notch services with unparalleled expertise.</p>
                    </div>
                </div>

                <div className="footer-text-bottom">
                    <p>© {new Date().getFullYear()} {businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;