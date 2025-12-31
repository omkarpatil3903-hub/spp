import React, { useEffect }  from 'react';
// import { SpecialtiesIconSvg } from './Icons';
import Aos from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const SpecialtiesPage = ({ data, getSafeArray }) => {
    const specialties = getSafeArray(data, 'Specialties');
    useEffect(() => {
        Aos.init({
             duration: 1000,
              once: true 
            }); // Initialize AOS with options
    }, []);
    return (
        <div className="page-container bg-gradient-green-lime">
            <div className="content-card" data-aos="fade-up" data-aos-delay="200">
                <h1 className="main-heading text-lime-800">
                    Our <span className="highlight-text-green">Specialties</span>
                </h1>
                <p className="sub-heading text-gray-700">
                    We pride ourselves on our core competencies and the specialized services we offer to our clients.
                </p>

                <div className="grid-3-cols md-grid-2-cols gap-6" data-aos="fade-up" data-aos-delay="300"> 
                    {specialties.length > 0 ? (
                        specialties.map((specialty, index) => (
                            <div key={index} className="specialty-item bg-gradient-teal-blue" data-aos="fade-up" data-aos-delay="800">
                                <div className="specialty-icon-container">
                                    ✓
                                </div>
                                <p className="specialty-text text-gray-800" data-aos="fade-up" data-aos-delay="400">{specialty}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">No specialties to display yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpecialtiesPage;