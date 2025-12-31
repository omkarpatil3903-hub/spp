import React from 'react';
import { HomeIconSvg, AboutUsIconSvg, ProductsIconSvg, SpecialtiesIconSvg, PersonIconSvg, ContactIconSvg } from './Icons';

const Navbar = ({ websiteData, setCurrentPage, currentPage, toggleSidebar }) => {
    const navItems = [
        { name: 'Home', page: 'home', icon: HomeIconSvg },
        { name: 'About Us', page: 'aboutUs', icon: AboutUsIconSvg },
        { name: 'Products', page: 'products', icon: ProductsIconSvg },
        { name: 'Specialties', page: 'specialties', icon: SpecialtiesIconSvg },
        { name: 'Best Employee', page: 'bestEmployee', icon: PersonIconSvg },
        { name: 'Contact Us', page: 'contactUs', icon: ContactIconSvg },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    {websiteData?.businessInfo?.businessName || 'Your Business'}
                </div>
                <button className="hamburger" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className="navbar-links">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            className={`nav-button ${currentPage === item.page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(item.page)}
                        >
                            <item.icon className="icon" />
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;