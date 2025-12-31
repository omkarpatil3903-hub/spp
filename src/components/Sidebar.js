import React from 'react';
import { HomeIconSvg, AboutUsIconSvg, ProductsIconSvg, SpecialtiesIconSvg, PersonIconSvg, ContactIconSvg } from './Icons';




const Sidebar = ({ isOpen, toggleSidebar, setCurrentPage, currentPage, websiteData }) => {
    const navItems = [
        { name: 'Home', page: 'home', icon: HomeIconSvg },
        { name: 'About Us', page: 'aboutUs', icon: AboutUsIconSvg },
        { name: 'Products', page: 'products', icon: ProductsIconSvg },
        { name: 'Specialties', page: 'specialties', icon: SpecialtiesIconSvg },
        { name: 'Best Employee', page: 'bestEmployee', icon: PersonIconSvg },
        { name: 'Contact Us', page: 'contactUs', icon: ContactIconSvg },
    ];

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-brand">
                        {websiteData?.businessInfo?.businessName || 'Your Business'}
                    </span>
                    <button className="close-button" onClick={toggleSidebar}>
                        ✕
                    </button>
                </div>
                <div className="sidebar-links">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            className={`sidebar-link ${currentPage === item.page ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentPage(item.page);
                                toggleSidebar();
                            }}
                        >
                            <item.icon className="icon" />Navbar
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={toggleSidebar}
            ></div>
        </>
    );
};

export default Sidebar;