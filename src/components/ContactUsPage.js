import React from 'react';
import { ContactIconSvg } from './Icons';

const ContactUsPage = ({ data, getSafeArray }) => {
    const contactInfo = data?.contacts?.contactInfo;
    const businessName = data?.businessInfo?.businessName || 'Our Business';

    return (
        <div className="page-container bg-gradient-indigo-purple">
            <div className="content-card">
                <h1 className="main-heading text-purple-600">
                    Contact <span className="highlight-text-indigo">{businessName}</span>
                </h1>
                <p className="sub-heading text-gray-700">
                    We'd love to hear from you! Reach out through any of the following channels.
                </p>

                <div className="contact-info-card bg-gradient-blue-indigo">
                    {contactInfo?.address && (
                        <div className="contact-item">
                            <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657M17.657 16.657A8 8 0 1118 10a8 8 0 01-3.343 6.657z"></path>
                            </svg>
                            <p className="contact-text">{contactInfo.address}</p>
                        </div>
                    )}
                    {contactInfo?.phone && (
                        <div className="contact-item">
                            <ContactIconSvg className="contact-icon color-indigo" />
                            <p className="contact-text">{contactInfo.phone}</p>
                        </div>
                    )}
                    {contactInfo?.email && (
                        <div className="contact-item">
                            <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p className="contact-text">
                                <a href={`mailto:${contactInfo.email}`} className="text-link-indigo">{contactInfo.email}</a>
                            </p>
                        </div>
                    )}
                    {contactInfo?.whatsapp && (
                        <div className="contact-item">
                            <svg className="contact-icon color-green" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.057 24L1.897 17.514C.942 16.035 0 14.398 0 12c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12c-2.398 0-4.035-.942-5.514-1.897L.057 24zm6.812-6.852l-.658.016c-.732.016-1.026.016-1.503-.016-.477-.033-.943-.099-1.423-.199-.48-.1-.944-.229-1.393-.389-.449-.159-.877-.348-1.285-.568-.408-.22-.796-.464-1.16-.732-.364-.268-.707-.562-1.025-.879-.318-.318-.609-.672-.879-1.025-.27-.364-.514-.752-.732-1.16-.22-.408-.389-.836-.568-1.285-.159-.449-.299-.913-.389-1.393-.1-.48-.166-.946-.199-1.423-.033-.477-.033-.771-.016-1.503l.016-.658 3.031-1.139c.287-.107.567-.225.829-.355.262-.13.497-.267.707-.406.21-.139.387-.279.531-.418.144-.139.246-.279.306-.418.06-.139.079-.279.059-.418-.02-.139-.079-.279-.179-.418-.1-.139-.24-.279-.418-.418-.179-.139-.387-.279-.624-.418-.237-.139-.498-.279-.785-.418-.287-.139-.609-.279-.968-.418-.359-.139-.766-.279-1.229-.418-.463-.139-.982-.279-1.554-.418l-1.127-.279c-.198-.05-.395-.12-.591-.208-.196-.089-.39-.193-.578-.313-.188-.12-.37-.257-.54-.409-.17-.152-.328-.318-.475-.499l-.014-.016c-.23-.268-.43-.559-.597-.872-.167-.313-.306-.652-.418-1.015-.112-.363-.194-.748-.246-1.155-.052-.407-.076-.83-.072-1.268.004-.438.038-.871.103-1.299.065-.428.163-.849.294-1.26.131-.411.299-.816.505-1.216.206-.4.44-.784.707-1.151.267-.367.562-.716.885-1.049.323-.333.679-.645 1.066-.937.387-.291.808-.56 1.258-.804.45-.245.928-.462 1.436-.651.508-.189 1.044-.35 1.608-.485 1.706-.397 3.513-.397 5.219-.001 2.457.57 4.544 1.954 6.203 4.103s2.518 4.773 2.518 7.371c0 2.202-.559 4.316-1.687 6.273-1.128 1.957-2.793 3.518-4.992 4.683-2.2.164-4.52.164-6.84 0l-3.033 1.139z"></path>
                            </svg>
                            <p className="contact-text">
                                <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-link-green">Chat on WhatsApp</a>
                            </p>
                        </div>
                    )}
                    {contactInfo?.timings && (
                        <div className="contact-item">
                            <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="contact-text">Hours: {contactInfo.timings}</p>
                        </div>
                    )}
                    {(contactInfo?.facebook || contactInfo?.instagram || contactInfo?.youtube) && (
                        <div className="social-links-container">
                            {contactInfo.facebook && (
                                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-link color-facebook">
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {contactInfo.instagram && (
                                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link color-instagram">
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.792.01 3.24.029 2.863.186 4.464 1.42 5.256 2.21.79.791 2.024 2.393 2.21 5.257.019.447.029.81.029 3.24s-.01 2.793-.029 3.24c-.186 2.863-1.42 4.464-2.21 5.256-.791.79-2.393 2.024-5.257 2.21-.447.019-.81.029-3.24.029s-2.793-.01-3.24-.029c-2.863-.186-4.464-1.42-5.256-2.21-.79-.791-2.024-2.393-2.21-5.257-.019-.447-.029-.81-.029-3.24s.01-2.793.029-3.24c.186-2.863 1.42-4.464 2.21-5.256.791-.79 2.393-2.024 5.257-2.21.447-.019.81-.029 3.24-.029zm0 2.163c-2.899 0-3.21.011-3.657.031-2.613.17-4.14 1.34-4.845 2.046-.705.705-1.876 2.232-2.046 4.845-.02.447-.031.758-.031 3.657s.011 3.21.031 3.657c.17 2.613 1.34 4.14 2.046 4.845.705.705 2.232 1.876 4.845 2.046.447.02 3.21.031 3.657.031s3.21-.011 3.657-.031c2.613-.17 4.14-1.34 4.845-2.046.705-.705 1.876-2.232 2.046-4.845.02-.447.031-.758.031-3.657s-.011-3.21-.031-3.657c-.17-2.613-1.34-4.14-2.046-4.845-.705-.705-1.876-2.232-4.845-2.046-.447-.02-3.21-.031-3.657-.031zM12.315 9.176c1.554 0 2.81 1.256 2.81 2.81s-1.256 2.81-2.81 2.81-2.81-1.256-2.81-2.81 1.256-2.81 2.81-2.81zm0 2.163c-.381 0-.693.312-.693.693s.312.693.693.693.693-.312.693-.693-.312-.693-.693-.693zM16.5 7.404c-.655 0-1.185.53-1.185 1.185s.53 1.185 1.185 1.185 1.185-.53 1.185-1.185-.53-1.185-1.185-1.185z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {contactInfo.youtube && (
                                <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-link color-youtube">
                                    <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19.812 5.44C19.423 3.523 17.994 2.073 16.074 1.684 14.854 1.342 12 1.342 12 1.342s-2.854 0-4.074.342C5.994 2.073 4.564 3.523 4.176 5.44 3.834 6.66 3.834 9.342 3.834 9.342s0 2.682.342 3.9C4.564 15.462 5.994 16.912 7.914 17.302 9.134 17.644 12 17.644 12 17.644s2.854 0 4.074-.342c1.92-.39 3.349-1.84 3.738-3.758.342-1.218.342-3.9.342-3.9s0-2.682-.342-3.9zm-8.47 8.35v-6.98l6.103 3.49-6.103 3.49z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;