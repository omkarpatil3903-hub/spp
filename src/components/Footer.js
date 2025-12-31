import React from 'react';

const Footer = ({ websiteData }) => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <p>© {new Date().getFullYear()} {websiteData?.businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem' }}>Designed and Developed with ❤️</p>
            </div>
        </footer>
    );
};

export default Footer;