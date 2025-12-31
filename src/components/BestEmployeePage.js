import React, { useState } from 'react';

const BestEmployeePage = ({ data, getSafeArray }) => {
    const bestEmployees = getSafeArray(data, 'BestEmployee');
    const [popupImage, setPopupImage] = useState(null);

    const handleImageClick = (imageUrl) => {
        setPopupImage(imageUrl);
    };

    const closePopup = () => {
        setPopupImage(null);
    };

    return (
        <>
            <div className="page-container bg-gradient-yellow-orange">
                <div className="content-card">
                    <h1 className="main-heading text-orange-800">
                        Our <span className="highlight-text-yellow">Star Performers</span>
                    </h1>
                    <p className="sub-heading text-gray-700">
                        We recognize and celebrate the exceptional contributions of our best employees. Their dedication drives our success.
                    </p>

                    <div className="grid-3-cols sm-grid-2-cols gap-6">
                        {bestEmployees.length > 0 ? (
                            bestEmployees.map((employee, index) => (
                                <div key={index} className="employee-card bg-gradient-purple-pink">
                                    <img
                                        src={employee.imageUrl || 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award'}
                                        alt={employee.employeeName}
                                        className="employee-img cursor-pointer"
                                        onClick={() => handleImageClick(employee.imageUrl || 'https://placehold.co/600x600/FDD835/616161?text=Employee')}
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award';
                                        }}
                                    />
                                    <h3 className="employee-name text-orange-800">{employee.employeeName}</h3>
                                    <p className="employee-award text-pink-600">{employee.awardName}</p>
                                    {employee.date && <p className="employee-date">Awarded on: {employee.date}</p>}
                                </div>
                                
                                
                            ))
                        ) : (
                            <p className="no-data-message">No best employee awards to display yet.</p>
                        )}
                    </div>
                     
                   

                    
                </div>
            </div>

            {/* Popup Modal */}
            {popupImage && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={closePopup}>
                    <div className="relative max-w-lg w-full p-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={popupImage}
                            alt="Employee"
                            className="w-full h-auto rounded shadow-lg"
                            onError={(e) => {
                                e.target.src = 'https://placehold.co/600x600/FDD835/616161?text=Employee';
                            }}
                        />
                        <button
                            className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1"
                            onClick={closePopup}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BestEmployeePage;
