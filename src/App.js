import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'; // Removed getAuth
import { getDatabase, ref, onValue, push, set } from 'firebase/database'; // Added getDatabase back
import { database, auth } from './firebase'; // Import initialized instances
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      "navbar.brand": "Your Politician",
      "nav.home": "Home",
      "nav.aboutUs": "About Us",
      "nav.products": "Products",
      "nav.specialties": "Specialties",
      "nav.bestEmployee": " Employee",
      "nav.gallery": "Gallery",
      "nav.contactUs": "Contact Us",
      "home.welcome": "Welcome to {{businessName}}",
      "home.discover": "Discover our services and see what makes us unique.",
      "home.products": "Our Products",
      "home.productsText": "Explore our cutting-edge products designed to meet your needs and exceed your expectations.",
      "home.specialties": "Our Specialties",
      "home.specialtiesText": "We specialize in delivering top-notch services with unparalleled expertise.",
      "about.title": "About {{businessName}}",
      "about.description": "We are passionate about delivering high-quality solutions and fostering strong relationships with our clients.",
      "about.noTeam": "No team members to display yet.",
      "products.title": "Our Products",
      "products.description": "Explore our diverse range of products designed to enhance your experience and provide exceptional value.",
      "products.noProducts": "No products to display yet.",
      "products.viewDetails": "View Details",
      "specialties.title": "Our Specialties",
      "specialties.description": "We pride ourselves on our core competencies and the specialized services we offer to our clients.",
      "specialties.noSpecialties": "No specialties to display yet.",
      "bestEmployee.title": "Meet Our Team",
      "bestEmployee.description": "We recognize and celebrate the exceptional contributions of our best employees. Their dedication drives our success.",
      "bestEmployee.noEmployees": "No best employee awards to display yet.",
      "gallery.title": "Our Gallery",
      "contact.title": "Contact Us",
      "contact.description": "We'd love to hear from you! Reach out to us through any of the following channels.",
      "contact.form.name": "Name:",
      "contact.form.phone": "Phone:",
      "contact.form.inquiry": "Inquiry:",
      "contact.form.submit": "Submit",
      "contact.form.error.fields": "Error: All fields must be filled out.",
      "contact.form.error.mobile": "Error: Invalid or missing mobile number. Cannot submit inquiry.",
      "contact.form.success": "Inquiry submitted successfully!",
      "contact.form.error.submit": "Failed to submit inquiry: {{error}}",
      "contact.hours": "Hours: {{timings}}",
      // "contact.whatsapp": "Chat on WhatsApp",
      "contact.share": "Share",
      "footer.text": "© {{year}} {{businessName}}. All rights reserved.",
      "footer.designed": "Designed and Developed with ❤️",
      "loading.text": "Loading website data...",
      "error.title": "Error!",
      "error.message": "{{error}}",
      "error.hint": "Please ensure your data is correctly structured in Realtime Database under: <br /><span class='code-path'>{{path}}</span>",
      "noData.title": "No Data Found",
      "noData.message": "No website data available for mobile number: <span class='highlight-text-yellow-dark'>{{mobile}}</span>.",
      "noData.hint": "Please ensure you have uploaded your business information to Realtime Database at: <br /><span class='code-path'>{{path}}</span>",
    }
  },
  hi: {
    translation: {
      "navbar.brand": "आपका राजनेता",
      "nav.home": "होम",
      "nav.aboutUs": "हमारे बारे में",
      "nav.products": "उत्पाद",
      "nav.specialties": "विशेषताएँ",
      "nav.bestEmployee": "कर्मचारी",
      "nav.gallery": "गैलरी",
      "nav.contactUs": "संपर्क करें",
      "home.welcome": "{{businessName}} में आपका स्वागत है",
      "home.discover": "हमारी सेवाओं की खोज करें और देखें कि हमें क्या अद्वितीय बनाता है।",
      "home.products": "हमारे उत्पाद",
      "home.productsText": "हमारे अत्याधुनिक उत्पादों की खोज करें जो आपकी जरूरतों को पूरा करने और आपकी अपेक्षाओं से अधिक करने के लिए डिज़ाइन किए गए हैं।",
      "home.specialties": "हमारी विशेषताएँ",
      "home.specialtiesText": "हम उच्च गुणवत्ता वाली सेवाएँ प्रदान करने में विशेषज्ञ हैं।",
      "about.title": "{{businessName}} के बारे में",
      "about.description": "हम उच्च गुणवत्ता वाले समाधान प्रदान करने और अपने ग्राहकों के साथ मजबूत संबंध बनाने के लिए उत्साहित हैं।",
      "about.noTeam": "अभी कोई टीम सदस्य प्रदर्शित करने के लिए नहीं हैं।",
      "products.title": "हमारे उत्पाद",
      "products.description": "हमारे विविध उत्पादों की श्रृंखला की खोज करें जो आपके अनुभव को बढ़ाने और असाधारण मूल्य प्रदान करने के लिए डिज़ाइन किए गए हैं।",
      "products.noProducts": "अभी कोई उत्पाद प्रदर्शित करने के लिए नहीं हैं।",
      "products.viewDetails": "विवरण देखें",
      "specialties.title": "हमारी विशेषताएँ",
      "specialties.description": "हमें अपनी मुख्य दक्षताओं और हमारे ग्राहकों को दी जाने वाली विशेष सेवाओं पर गर्व है।",
      "specialties.noSpecialties": "अभी कोई विशेषताएँ प्रदर्शित करने के लिए नहीं हैं।",
      "bestEmployee.title": "हमारी टीम से मिलें",
      "bestEmployee.description": "हम अपने सर्वश्रेष्ठ कर्मचारियों के असाधारण योगदान को पहचानते और सम्मन करते हैं। उनकी समर्पण हमारी सफलता को बढ़ाता है।",
      "bestEmployee.noEmployees": "अभी कोई सर्वश्रेष्ठ कर्मचारी पुरस्कार प्रदर्शित करने के लिए नहीं हैं।",
      "gallery.title": "हमारी गैलरी",
      "contact.title": "संपर्क करें",
      "contact.description": "हम आपसे सुनना चाहेंगे! निम्नलिखित किसी भी माध्यम से हमसे संपर्क करें।",
      "contact.form.name": "नाम:",
      "contact.form.phone": "फोन:",
      "contact.form.inquiry": "पूछताछ:",
      "contact.form.submit": "जमा करें",
      "contact.form.error.fields": "त्रुटि: सभी क्षेत्र भरना अनिवार्य है।",
      "contact.form.error.mobile": "त्रुटि: अमान्य या अनुपस्थित मोबाइल नंबर। पूछताछ जमा नहीं की जा सकती।",
      "contact.form.success": "पूछताछ सफलतापूर्वक जमा की गई!",
      "contact.form.error.submit": "पूछताछ जमा करने में विफल: {{error}}",
      "contact.hours": "समय: {{timings}}",
      "contact.whatsapp": "व्हाट्सएप पर चैट करें",
      "contact.share": "साझा करें",
      "footer.text": "© {{year}} {{businessName}}। सर्वाधिकार सुरक्षित।",
      "footer.designed": "❤️ के साथ डिज़ाइन और विकसित",
      "loading.text": "वेबसाइट डेटा लोड हो रहा है...",
      "error.title": "त्रुटि!",
      "error.message": "{{error}}",
      "error.hint": "कृपया सुनिश्चित करें कि आपका डेटा रियलटाइम डेटाबेस में सही ढंग से संरचित है: <br /><span class='code-path'>{{path}}</span>",
      "noData.title": "कोई डेटा नहीं मिला",
      "noData.message": "मोबाइल नंबर के लिए कोई वेबसाइट डेटा उपलब्ध नहीं: <span class='highlight-text-yellow-dark'>{{mobile}}</span>।",
      "noData.hint": "कृपया सुनिश्चित करें कि आपने रियलटाइम डेटाबेस में अपनी व्यावसायिक जानकारी अपलोड की है: <br /><span class='code-path'>{{path}}</span>",
    }
  },
  mr: {
    translation: {
      "navbar.brand": "तुमचा राजकारणी",
      "nav.home": "मुख्यपृष्ठ",
      "nav.aboutUs": "आमच्याबद्दल",
      "nav.products": "उत्पादने",
      "nav.specialties": "विशेषता",
      "nav.bestEmployee": "कर्मचारी",
      "nav.gallery": "गॅलरी",
      "nav.contactUs": "संपर्क साधा",
      "home.welcome": "{{businessName}} मध्ये आपले स्वागत आहे",
      "home.discover": "आमच्या सेवांचा शोध घ्या आणि आम्हाला काय अद्वितीय बनवते ते पहा.",
      "home.products": "आमची उत्पादने",
      "home.productsText": "आमच्या अत्याधुनिक उत्पादनांचा शोध घ्या जे तुमच्या गरजा पूर्ण करण्यासाठी आणि तुमच्या अपेक्षांपेक्षा जास्त करण्यासाठी डिझाइन केले आहेत.",
      "home.specialties": "आमच्या विशेषता",
      "home.specialtiesText": "आम्ही उच्च दर्जाच्या सेवा प्रदान करण्यात विशेषज्ञ आहोत.",
      "about.title": "{{businessName}} बद्दल",
      "about.description": "आम्ही उच्च दर्जाचे उपाय प्रदान करण्यासाठी आणि आमच्या ग्राहकांशी मजबूत संबंध निर्माण करण्यासाठी उत्साही आहोत.",
      "about.noTeam": "अद्याप प्रदर्शित करण्यासाठी कोणतेही संघ सदस्य नाहीत.",
      "products.title": "आमची उत्पादने",
      "products.description": "आमच्या विविध उत्पादनांच्या श्रेणीचा शोध घ्या जे तुमचा अनुभव वाढवण्यासाठी आणि अपवादात्मक मूल्य प्रदान करण्यासाठी डिझाइन केले आहेत.",
      "products.noProducts": "अद्याप प्रदर्शित करण्यासाठी कोणतीही उत्पादने नाहीत.",
      "products.viewDetails": "तपशील पहा",
      "specialties.title": "आमच्या विशेषता",
      "specialties.description": "आम्हाला आमच्या मुख्य क्षमता आणि आमच्या ग्राहकांना दिलेल्या विशेष सेवांवर अभिमान आहे.",
      "specialties.noSpecialties": "अद्याप प्रदर्शित करण्यासाठी कोणत्याही विशेषता नाहीत.",
      "bestEmployee.title": "आमच्या संघाला भेटा",
      "bestEmployee.description": "आम्ही आमच्या सर्वोत्तम कर्मचार्‍यांच्या अपवादात्मक योगदानाला ओळखतो आणि सन्मान करतो. त्यांचे समर्पण आमच्या यशाला चालना देते.",
      "bestEmployee.noEmployees": "अद्याप प्रदर्शित करण्यासाठी कोणतेही सर्वोत्तम कर्मचारी पुरस्कार नाहीत.",
      "gallery.title": "आमची गॅलरी",
      "contact.title": "संपर्क साधा",
      "contact.description": "आम्हाला तुमच्याकडून ऐकायला आवडेल! खालील कोणत्याही माध्यमातून आमच्याशी संपर्क साधा.",
      "contact.form.name": "नाव:",
      "contact.form.phone": "फोन:",
      "contact.form.inquiry": "चौकशी:",
      "contact.form.submit": "सबमिट करा",
      "contact.form.error.fields": "त्रुटी: सर्व फील्ड भरलेली असणे आवश्यक आहे.",
      "contact.form.error.mobile": "त्रुटी: अवैध किंवा गहाळ मोबाइल नंबर. चौकशी सबमिट करू शकत नाही.",
      "contact.form.success": "चौकशी यशस्वीरित्या सबमिट केली!",
      "contact.form.error.submit": "चौकशी सबमिट करण्यात अयशस्वी: {{error}}",
      "contact.hours": "वेळ: {{timings}}",
      "contact.whatsapp": "व्हॉट्सअॅपवर चॅट करा",
      "contact.share": "सामायिक करा",
      "footer.text": "© {{year}} {{businessName}}. सर्व हक्क राखीव.",
      "footer.designed": "सह डिझाइन आणि विकसित सह ❤️",
      "loading.text": "वेबसाइट डेटा लोड होत आहे...",
      "error.title": "त्रुटी!",
      "error.message": "{{error}}",
      "error.hint": "कृपया खात्री करा की तुमचा डेटा रियलटाइम डेटाबेसमध्ये योग्यरित्या संरचित आहे: <br /><span class='code-path'>{{path}}</span>",
      "noData.title": "कोणताही डेटा सापडला नाही",
      "noData.message": "मोबाइल नंबरसाठी कोणताही वेबसाइट डेटा उपलब्ध नाही: <span class='highlight-text-yellow-dark'>{{mobile}}</span>.",
      "noData.hint": "कृपया खात्री करा की तुम्ही रियलटाइम डेटाबेसमध्ये तुमची व्यावसायिक माहिती अपलोड केली आहे: <br /><span class='code-path'>{{path}}</span>",
    }
  },
  kn: {
    translation: {
      "navbar.brand": "ನಿಮ್ಮ ರಾಜಕಾರಣಿ",
      "nav.home": "ಮುಖಪುಟ",
      "nav.aboutUs": "ನಮ್ಮ ಬಗ್ಗೆ",
      "nav.products": "ಉತ್ಪನ್ನಗಳು",
      "nav.specialties": "ವಿಶೇಷತೆಗಳು",
      "nav.bestEmployee": " ಉದ್ಯೋಗಿ",
      "nav.gallery": "ಗ್ಯಾಲರಿ",
      "nav.contactUs": "ಸಂಪರ್ಕಿಸಿ",
      "home.welcome": "{{businessName}} ಗೆ ಸ್ವಾಗತ",
      "home.discover": "ನಮ್ಮ ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ನಮ್ಮನ್ನು ವಿಶಿಷ್ಟವಾಗಿಸುವುದನ್ನು ನೋಡಿ.",
      "home.products": "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು",
      "home.productsText": "ನಿಮ್ಮ ಅಗತ್ಯಗಳನ್ನು ಪೂರೈಸಲು ಮತ್ತು ನಿಮ್ಮ ನಿರೀಕ್ಷೆಗಳನ್ನು ಮೀರಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ನಮ್ಮ ಅತ್ಯಾಧುನಿಕ ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
      "home.specialties": "ನಮ್ಮ ವಿಶೇಷತೆಗಳು",
      "home.specialtiesText": "ನಾವು ಉನ್ನತ ಗುಣಮಟ್ಟದ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುವಲ್ಲಿ ಪರಿಣತರಾಗಿದ್ದೇವೆ.",
      "about.title": "{{businessName}} ಬಗ್ಗೆ",
      "about.description": "ನಾವು ಉನ್ನತ ಗುಣಮಟ್ಟದ ಪರಿಹಾರಗಳನ್ನು ಒದಗಿಸಲು ಮತ್ತು ನಮ್ಮ ಗ್ರಾಹಕರೊಂದಿಗೆ ಬಲವಾದ ಸಂಬಂಧಗಳನ್ನು ಬೆಳೆಸಲು ಉತ್ಸುಕರಾಗಿದ್ದೇವೆ.",
      "about.noTeam": "ಪ್ರದರ್ಶಿಸಲು ಇನ್ನೂ ಯಾವುದೇ ತಂಡದ ಸದಸ್ಯರಿಲ್ಲ.",
      "products.title": "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು",
      "products.description": "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಅಸಾಧಾರಣ ಮೌಲ್ಯವನ್ನು ಒದಗಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ನಮ್ಮ ವೈವಿಧ್ಯಮಯ ಉತ್ಪನ್ನಗಳ ಶ್ರೇಣಿಯನ್ನು ಅನ್ವೇಷಿಸಿ.",
      "products.noProducts": "ಪ್ರದರ್ಶಿಸಲು ಇನ್ನೂ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳಿಲ್ಲ.",
      "products.viewDetails": "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      "specialties.title": "ನಮ್ಮ ವಿಶೇಷತೆಗಳು",
      "specialties.description": "ನಮ್ಮ ಮೂಲ ಸಾಮರ್ಥ್ಯಗಳು ಮತ್ತು ನಮ್ಮ ಗ್ರಾಹಕರಿಗೆ ನೀಡುವ ವಿಶೇಷ ಸೇವೆಗಳ ಬಗ್ಗೆ ನಾವು ಹೆಮ್ಮೆಪಡುತ್ತೇವೆ.",
      "specialties.noSpecialties": "ಪ್ರದರ್ಶಿಸಲು ಇನ್ನೂ ಯಾವುದೇ ವಿಶೇಷತೆಗಳಿಲ್ಲ.",
      "bestEmployee.title": "ನಮ್ಮ ತಂಡವನ್ನು ಭೇಟಿಯಾಗಿ",
      "bestEmployee.description": "ನಾವು ನಮ್ಮ ಶ್ರೇಷ್ಠ ಉದ್ಯೋಗಿಗಳ ಅಸಾಧಾರಣ ಕೊಡುಗೆಯನ್ನು ಗುರುತಿಸುತ್ತೇವೆ ಮತ್ತು ಗೌರವಿಸುತ್ತೇವೆ. ಅವರ ಸಮರ್ಪಣೆ ನಮ್ಮ ಯಶಸ್ಸನ್ನು ಚಾಲನೆ ಮಾಡುತ್ತದೆ.",
      "bestEmployee.noEmployees": "ಪ್ರದರ್ಶಿಸಲು ಇನ್ನೂ ಯಾವುದೇ ಶ್ರೇಷ್ಠ ಉದ್ಯೋಗಿ ಪ್ರಶಸ್ತಿಗಳಿಲ್ಲ.",
      "gallery.title": "ನಮ್ಮ ಗ್ಯಾಲರಿ",
      "contact.title": "ಸಂಪರ್ಕಿಸಿ",
      "contact.description": "ನಾವು ನಿಮ್ಮಿಂದ ಕೇಳಲು ಇಷ್ಟಪಡುತ್ತೇವೆ! ಈ ಕೆಳಗಿನ ಯಾವುದೇ ಚಾನಲ್‌ಗಳ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      "contact.form.name": "ಹೆಸರು:",
      "contact.form.phone": "ಫೋನ್:",
      "contact.form.inquiry": "ವಿಚಾರಣೆ:",
      "contact.form.submit": "ಸಲ್ಲಿಸಿ",
      "contact.form.error.fields": "ದೋಷ: ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಬೇಕು.",
      "contact.form.error.mobile": "ದೋಷ: ಅಮಾನ್ಯ ಅಥವಾ ಕಾಣೆಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ. ವಿಚಾರಣೆಯನ್ನು ಸಲ್ಲಿಸಲಾಗದು.",
      "contact.form.success": "ವಿಚಾರಣೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
      "contact.form.error.submit": "ವಿಚಾರಣೆಯನ್ನು ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ: {{error}}",
      "contact.hours": "ಗಂಟೆಗಳು: {{timings}}",
      "contact.whatsapp": "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ",
      "contact.share": "ಹಂಚಿಕೊಳ್ಳಿ",
      "footer.text": "© {{year}} {{businessName}}. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      "footer.designed": "❤️ ಜೊತೆಗೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ ಮತ್ತು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ",
      "loading.text": "ವೆಬ್‌ಸೈಟ್ ಡೇಟಾವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      "error.title": "ದೋಷ!",
      "error.message": "{{error}}",
      "error.hint": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ರಿಯಲ್‌ಟೈಮ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸರಿಯಾಗಿ ರಚನೆಗೊಳಿಸಲಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ: <br /><span class='code-path'>{{path}}</span>",
      "noData.title": "ಯಾವುದೇ ಡೇಟಾವಿಲ್ಲ",
      "noData.message": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಯಾವುದೇ ವೆಬ್‌ಸೈಟ್ ಡೇಟಾವಿಲ್ಲ: <span class='highlight-text-yellow-dark'>{{mobile}}</span>.",
      "noData.hint": "ದಯವಿಟ್ಟು ನೀವು ರಿಯಲ್‌ಟೈಮ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ನಿಮ್ಮ ವ್ಯಾಪಾರ ಮಾಹಿತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ್ದೀರಿ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ: <br /><span class='code-path'>{{path}}</span>",
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'mr', // Default language
    fallbackLng: 'en', // Fallback to English
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

// Firebase configuration
// Firebase initialization moved to ./firebase.js
// const analytics = getAnalytics(app); // Analytics relies on app, if needed import app from firebase.js

// Icons
const HomeIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const AboutUsIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-9a2 2 0 00-2-2h-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v9m14 0a6 6 0 00-6-6v6m6-3h-6"></path></svg>
);
const ProductsIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);
const SpecialtiesIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2M9 12H7m8-2v2m-8 2h2m6 0h2"></path></svg>
);
const GalleryIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path></svg>
);
const BestEmployeeIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ContactIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
);

// Helper function to safely get data and convert objects to arrays
const getSafeArray = (data, key) => {
  const item = data?.[key];
  if (Array.isArray(item)) {
    return item.filter(Boolean);
  }
  if (typeof item === 'object' && item !== null) {
    return Object.values(item).filter(Boolean);
  }
  return [];
};

// Home Page Component
const HomePage = ({ data }) => {
  const { t } = useTranslation();
  const businessInfo = data?.businessInfo;
  const images = getSafeArray(data, 'images');
  const mainImageUrl = images.length > 0 ? images[0].imageUrl : 'https://placehold.co/1200x400/CCCCCC/333333?text=Main+Image';
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="page-container bg-gradient-purple-indigo">
      <div className="content-card">
        {/* Home Section */}
        <div id="home">
          <h1 className="main-heading text-indigo-800">
            {t('home.welcome', { businessName: businessInfo?.businessName || 'Our Business' })}
          </h1>
          <p className="sub-heading text-gray-700">
            {t('home.discover', { defaultValue: businessInfo?.AboutBusiness || 'Discover our services and see what makes us unique.' })}
          </p>
          <div className="center-wrapper-image">
            <div className="image-hero-container">
              <img
                src={businessInfo?.businessLogo || mainImageUrl}
                alt="Business Main"
                className="image-cover hover-scale"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/1200x400/CCCCCC/333333?text=Image+Not+Found';
                }}
              />
            </div>
          </div>
          <div className="grid-2-cols gap-8 mt-12" data-aos="fade-up" data-aos-delay="100">
            <div className="card-item bg-gradient-blue-light">
              <h3 className="card-title text-blue-700" data-aos="fade-up" data-aos-delay="100"><ProductsIcon /> {t('home.products')}</h3>
              <p className="card-text">{t('home.productsText')}</p>
            </div>
            <div className="card-item bg-gradient-green-light" data-aos="fade-up" data-aos-delay="200">
              <h3 className="card-title text-green-700" data-aos="fade-up" data-aos-delay="400"><SpecialtiesIcon /> {t('home.specialties')}</h3>
              <p className="card-text">{t('home.specialtiesText')}</p>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div id="aboutUs" className="mt-12">
          <AboutUsPage data={data} />
        </div>

        {/* Products Section */}
        <div id="products" className="mt-12">
          <ProductsPage data={data} />
        </div>

        {/* Specialties Section */}
        <div id="specialties" className="mt-12">
          <SpecialtiesPage data={data} />
        </div>

        {/* Best Employee Section */}
        <div id="bestEmployee" className="mt-12">
          <BestEmployeePage data={data} />
        </div>

        {/* Gallery Section */}
        <div id="images" className="mt-12">
          <Gallery data={data} />
        </div>

        {/* Contact Section */}
        <div id="contactUs" className="mt-12">
          <ContactUsPage data={data} />
        </div>
      </div>
    </div>
  );
};

// About Us Page Component
const AboutUsPage = ({ data }) => {
  const { t } = useTranslation();
  const teamMembers = getSafeArray(data, 'AboutUs');
  const businessName = data?.businessInfo?.businessName || 'Our Business';
  const aboutBusiness = data?.businessInfo?.AboutBusiness || 'A leading company committed to innovation and excellence.';
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div data-aos="fade-up" data-aos-delay="300">
      <h1 className="main-heading highlight-text-indigo">
        {t('about.title', { businessName })}
      </h1>
      <p className="sub-heading text-gray-700 mb-8">{aboutBusiness}</p>
      <div className="grid-3-cols sm-grid-2-cols gap-8">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div key={member.id} className="team-member-card bg-gradient-indigo-purple">
              <h3 className="team-member-name text-indigo-800">{member.name}</h3>
              <p className="team-member-position text-purple-600">{member.position}</p>
              {member.date && <p className="team-member-date">{t('about.date', { defaultValue: 'Joined: {{date}}', date: member.date })}</p>}
            </div>
          ))
        ) : (
          <p className="no-data-message">{t('about.noTeam')}</p>
        )}
      </div>
    </div>
  );
};

// Products Page Component
const ProductsPage = ({ data }) => {
  const { t } = useTranslation();
  const products = getSafeArray(data, 'Products');
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div data-aos="fade-up" data-aos-delay="200">
      <h1 className="main-heading text-red-800">
        {t('products.title')}
      </h1>
      <p className="sub-heading text-gray-700">
        {t('products.description')}
      </p>
      <div className="grid-3-cols sm-grid-2-cols gap-8" data-aos="fade-up" data-aos-delay="300">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card bg-gradient-gray-light">
              <img
                src={product.imageUrl || 'https://placehold.co/400x300/CCCCCC/333333?text=Product+Image'}
                alt={product.name}
                className="w-[250px] h-[250px] object-cover mx-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/333333?text=Product+Image'; }}
              />
              <div className="product-details">
                <h3 className="product-name text-gray-800">{product.name}</h3>
                <p className="product-price text-pink-600">₹{parseFloat(product.price).toFixed(2) || 'N/A'}</p>
                <p className="product-description text-gray-700">
                  {product.description || t('products.description')}
                </p>
                <button className="product-button bg-pink-500 hover-bg-pink-600">
                  {t('products.viewDetails')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-message">{t('products.noProducts')}</p>
        )}
      </div>
    </div>
  );
};

// Specialties Page Component
const SpecialtiesPage = ({ data }) => {
  const { t } = useTranslation();
  const specialties = getSafeArray(data, 'Specialties');
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div data-aos="fade-up" data-aos-delay="300" data-aos-once="false" data-aos-mirror="true">
      <h1 className="main-heading text-lime-800" data-aos-delay="300">
        {t('specialties.title')}
      </h1>
      <p className="sub-heading text-gray-700" data-aos="fade-up" data-aos-delay="300">
        {t('specialties.description')}
      </p>
      <div className="grid-3-cols md-grid-2-cols gap-8" data-aos="fade-up" data-aos-delay="400">
        {specialties.length > 0 ? (
          specialties.map((specialty, index) => (
            <div key={index} className="specialty-item bg-gradient-teal-blue" data-aos="zoom-in" data-aos-delay="500">
              <div className="specialty-icon-container">
                ✓
              </div>
              <p className="specialty-text text-gray-800">{specialty}</p>
            </div>
          ))
        ) : (
          <p className="no-data-message">{t('specialties.noSpecialties')}</p>
        )}
      </div>
    </div>
  );
};

// Best Employee Page Component
const BestEmployeePage = ({ data }) => {
  const { t } = useTranslation();
  const bestEmployees = getSafeArray(data, 'BestEmployee');
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <h1 className="main-heading text-orange-800" data-aos="fade-up" data-aos-delay="300">
        {t('bestEmployee.title')}
      </h1>
      <p className="sub-heading text-gray-700" data-aos="fade-up" data-aos-delay="300">
        {t('bestEmployee.description')}
      </p>
      <div className="grid-3-cols sm-grid-2-cols" data-aos="fade-up" data-aos-delay="300">
        {bestEmployees.length > 0 ? (
          bestEmployees.map((employee, index) => (
            <div key={index} className="employee-card bg-gradient-purple-pink">
              <img
                src={employee.imageUrl || 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award'}
                alt={employee.employeeName}
                className="employee-img"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award'; }}
              />
              <h3 className="employee-name text-orange-800">{employee.employeeName}</h3>
              <p className="employee-award text-pink-600">{employee.awardName}</p>
              {employee.date && <p className="employee-date">{t('bestEmployee.date', { defaultValue: 'Awarded on: {{date}}', date: employee.date })}</p>}
            </div>
          ))
        ) : (
          <p className="no-data-message">{t('bestEmployee.noEmployees')}</p>
        )}
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = ({ data }) => {
  const { t } = useTranslation();
  const images = getSafeArray(data, 'images');
  const [selectedImage, setSelectedImage] = useState(null);

  const openPopup = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <h1 className="main-heading highlight-text-blue text-purple-800" data-aos="fade-up" data-aos-delay="300">
        {t('gallery.title')}
      </h1>
      <div className="gallery-grid">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="gallery-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <img
                src={image.imageUrl || 'https://placehold.co/180x180/FDD835/616161?text=Gallery'}
                alt={image.employeeName}
                className="gallery-img"
                onClick={() => openPopup(image.imageUrl)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/180x180/FDD835/616161?text=Gallery';
                }}
              />
            </div>
          ))
        ) : (
          <p className="no-data-message">{t('bestEmployee.noEmployees')}</p>
        )}
      </div>
      {selectedImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full View" className="popup-image" />
            <button className="popup-close-button" onClick={closePopup}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Contact Us Page Component
const ContactUsPage = ({ data }) => {
  const { t } = useTranslation();
  const { mobileNumber } = useParams();
  const cleanMobile = String(mobileNumber || '').trim();
  const contactInfo = data?.contacts?.contactInfo;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    inquiry: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(cleanMobile)) {
      alert(t('contact.form.error.mobile'));
      return;
    }

    const { name, contact, inquiry } = formData;
    if (!name.trim() || !contact.trim() || !inquiry.trim()) {
      alert(t('contact.form.error.fields'));
      return;
    }

    try {
      const db = getDatabase();
      const inquiriesRef = ref(db, `MarketingPro/WebBuilder/${cleanMobile}/Inquiries`);
      const newInquiryRef = push(inquiriesRef);
      await set(newInquiryRef, {
        ...formData,
        timestamp: Date.now(),
      });

      alert(t('contact.form.success'));
      setFormData({ name: '', contact: '', inquiry: '' });
    } catch (error) {
      alert(t('contact.form.error.submit', { error: error.message }));
    }
  };

  return (
    <div data-aos="fade-up" data-aos-delay="300">
      <h1 className="main-heading text-purple-800">
        {t('contact.title')}
      </h1>
      <p className="sub-heading text-gray-700">
        {t('contact.description')}
      </p>

      <div className="contact-grid-container grid-2-cols">
        {/* Left Column: Inquiry Form */}
        <div className="contact-form-wrapper bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">{t('contact.form.title', 'Send us a Message')}</h3>
          <form className="inquiry-form flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.phone')}</label>
              <input
                type="text"
                id="contact"
                name="contact"
                maxLength={10}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={formData.contact}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, contact: onlyNumbers });
                }}
                required
                placeholder="10-digit Mobile Number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.inquiry')}</label>
              <textarea
                id="inquiry"
                name="inquiry"
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                value={formData.inquiry}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              {t('contact.form.submit')}
            </button>
          </form>
        </div>

        {/* Right Column: Contact Info */}
        {/* Added h-full to wrapper and specific styles to ensure it fills height and looks dynamic */}
        <div className="contact-info-wrapper flex flex-col h-full" style={{ height: '100%' }}>
          {/* Updated to match project card style */}
          <div className="contact-details-card bg-gradient-blue-light text-gray-800 p-8 rounded-xl shadow-lg flex-1 flex flex-col justify-center h-full border border-blue-100">
            <h3 className="text-2xl font-bold mb-8 border-b border-blue-200 pb-4 text-blue-700 tracking-wide">Contact Information</h3>

            <div className="flex flex-col gap-6">
              {contactInfo?.address && (
                <div className="contact-item flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-300">
                  <div className="bg-blue-500 p-3 rounded-full shrink-0 shadow-md text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-blue-600 mb-1">Our Location</p>
                    <p className="text-lg font-medium text-gray-700 leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>
              )}

              {contactInfo?.phone && (
                <div className="contact-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-300">
                  <div className="bg-green-500 p-3 rounded-full shrink-0 shadow-md text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-blue-600 mb-1">Phone Number</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">{contactInfo.phone}</a>
                  </div>
                </div>
              )}

              {contactInfo?.email && (
                <div className="contact-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-300">
                  <div className="bg-pink-500 p-3 rounded-full shrink-0 shadow-md text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-blue-600 mb-1">Email Address</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors break-all">{contactInfo.email}</a>
                  </div>
                </div>
              )}

              {contactInfo?.timings && (
                <div className="contact-item flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-300">
                  <div className="bg-yellow-500 p-3 rounded-full shrink-0 shadow-md text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wider text-blue-600 mb-1">Business Hours</p>
                    <p className="text-lg font-medium text-gray-700">{contactInfo.timings}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(contactInfo?.facebook || contactInfo?.instagram || contactInfo?.youtube || contactInfo?.whatsapp) && (
              <div className="mt-10 pt-6 border-t border-blue-200">
                <p className="text-center font-bold mb-6 text-blue-700 tracking-wide uppercase text-sm">Connect With Us</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {contactInfo.facebook && (
                    <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" /></svg>
                    </a>
                  )}
                  {contactInfo.instagram && (
                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="bg-pink-600 text-white p-3 rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-pink-500/50">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.792.01 3.24.029 2.863.186 4.464 1.42 5.256 2.21.79.791 2.024 2.393 2.21 5.257.019.447.029.81.029 3.24s-.01 2.793-.029 3.24c-.186 2.863-1.42 4.464-2.21 5.256-.791.79-2.393 2.024-5.257 2.21-.447.019-.81.029-3.24.029s-2.793-.01-3.24-.029c-2.863-.186-4.464-1.42-5.256-2.21-.79-.791-2.024-2.393-2.21-5.257-.019-.447-.029-.81-.029-3.24s.01-2.793.029-3.24c.186-2.863 1.42-4.464 2.21-5.256.791-.79 2.393-2.024 5.257-2.21.447-.019.81-.029 3.24-.029zm0 2.163c-2.899 0-3.21.011-3.657.031-2.613.17-4.14 1.34-4.845 2.046-.705.705-1.876 2.232-2.046 4.845-.02.447-.031.758-.031 3.657s.011 3.21.031 3.657c.17 2.613 1.34 4.14 2.046 4.845.705.705 2.232 1.876 4.845 2.046.447.02.758.031 3.657.031s3.21-.011 3.657-.031c2.613-.17 4.14-1.34 4.845-2.046.705-.705 1.876-2.232 2.046-4.845.02-.447.031-.758.031-3.657s-.011-3.21-.031-3.657c-.17-2.613-1.34-4.14-2.046-4.845-.705-.705-2.232-1.876-4.845-2.046-.447-.02-.758-.031-3.657-.031zM12.315 9.176c1.554 0 2.81 1.256 2.81 2.81s-1.256 2.81-2.81 2.81-2.81-1.256-2.81-2.81 1.256-2.81 2.81-2.81zm0 2.163c-.381 0-.693.312-.693.693s.312.693.693.693.693-.312.693-.693-.312-.693-.693-.693zM16.5 7.404c-.655 0-1.185.53-1.185 1.185s.53 1.185 1.185 1.185 1.185-.53 1.185-1.185-.53-1.185-1.185-1.185z" /></svg>
                    </a>
                  )}
                  {contactInfo.youtube && (
                    <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white p-3 rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-red-500/50">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.812 5.44C19.423 3.523 17.994 2.073 16.074 1.684 14.854 1.342 12 1.342 12 1.342s-2.854 0-4.074.342C5.994 2.073 4.564 3.523 4.176 5.44 3.834 6.66 3.834 9.342 3.834 9.342s0 2.682.342 3.9C4.564 15.462 5.994 16.912 7.914 17.302 9.134 17.644 12 17.644 12 17.644s2.854 0 4.074-.342c1.92-.39 3.349-1.84 3.738-3.758.342-1.218.342-3.9.342-3.9s0-2.682-.342-3.9zm-8.47 8.35v-6.98l6.103 3.49-6.103 3.49z" /></svg>
                    </a>
                  )}
                  {contactInfo.whatsapp && (
                    <a href={`https://wa.me/?text=${encodeURIComponent(t('contact.share') + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-3 rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-green-500/50">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="mr">मराठी</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>
    </div>
  );
};

function App() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('home');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mobileNumber } = useParams();
  const trimmedMobileNumber = mobileNumber ? mobileNumber.trim() : '';
  const isValidMobileNumber = trimmedMobileNumber && /^\d{10}$/.test(trimmedMobileNumber);
  const REALTIME_DB_PATH = isValidMobileNumber ? `MarketingPro/WebBuilder/${trimmedMobileNumber}` : null;

  // Smooth scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 100; // Height of fixed navbar + extra padding to ensure header is visible
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setCurrentPage(sectionId);
    }
  };

  // Scroll Spy Effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'aboutUs', 'products', 'specialties', 'bestEmployee', 'images', 'contactUs'];
      const navbarHeight = 110; // Slightly more than click offset to highlight earlier

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if top of section is near the top of the viewport (under navbar)
          // or if bottom of section is still in view
          if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
            setCurrentPage(sectionId);
            break; // Found the current section
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      // Use imported instances
      setDb(database);
      setAuth(auth);

      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            const userCredential = await signInAnonymously(auth);
          } catch (e) {
            setError(t('error.message', { error: `Authentication failed: ${e.message}. Data access may be unaffected due to permissive rules.` }));
            setLoading(false);
          }
        }
      });

      return () => unsubscribeAuth();
    } catch (e) {
      setError(t('error.message', { error: 'Failed to initialize Firebase. Please check your configuration.' }));
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!mobileNumber) {
      setError(t('error.message', { error: 'Missing mobile number in the URL. Ensure URL is like /9370329233.' }));
      setLoading(false);
      return;
    }
    if (!isValidMobileNumber) {
      setError(t('error.message', { error: `Invalid mobile number: "${mobileNumber}". Must be exactly 10 digits.` }));
      setLoading(false);
      return;
    }

    if (db && REALTIME_DB_PATH) {
      const dataRef = ref(db, REALTIME_DB_PATH);
      const unsubscribeData = onValue(
        dataRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const fetchedData = snapshot.val();
            setWebsiteData(fetchedData);
            setError(null);
          } else {
            setWebsiteData(null);
            setError(t('error.message', { error: `No website data found for mobile number: ${trimmedMobileNumber}.` }));
          }
          setLoading(false);
        },
        (e) => {
          setError(t('error.message', { error: `Failed to load data: ${e.message}.` }));
          setLoading(false);
        }
      );

      return () => unsubscribeData();
    }
  }, [db, REALTIME_DB_PATH, isValidMobileNumber, trimmedMobileNumber, mobileNumber, t]);

  const renderPage = useCallback(() => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">{t('loading.text')}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <h2 className="error-heading">{t('error.title')}</h2>
          <p className="error-message">{error}</p>
          <p
            className="error-hint"
            dangerouslySetInnerHTML={{
              __html: t('error.hint', {
                path: REALTIME_DB_PATH || 'MarketingPro/WebBuilder/{mobileNumber}'
              })
            }}
          ></p>
        </div>
      );
    }

    if (!websiteData) {
      return (
        <div className="no-data-container">
          <h2 className="no-data-heading">{t('noData.title')}</h2>
          <p
            className="no-data-message-text"
            dangerouslySetInnerHTML={{
              __html: t('noData.message', { mobile: trimmedMobileNumber })
            }}
          ></p>
          <p
            className="no-data-hint"
            dangerouslySetInnerHTML={{
              __html: t('noData.hint', { path: REALTIME_DB_PATH })
            }}
          ></p>
        </div>
      );
    }

    // Always render HomePage with all sections
    return <HomePage data={websiteData} />;
  }, [loading, error, websiteData, REALTIME_DB_PATH, trimmedMobileNumber, isValidMobileNumber, t]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="app-container">
      {/* Top Navbar - Shows business name and language switcher */}
      <div className="navbar-container">
        <div className="navbar-brand">
          {t('navbar.brand', { defaultValue: websiteData?.businessInfo?.businessName || 'Your Business' })}
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="navbar-links-desktop">
          {[
            { key: 'home', icon: <HomeIcon />, label: t('nav.home') },
            { key: 'aboutUs', icon: <AboutUsIcon />, label: t('nav.aboutUs') },
            { key: 'products', icon: <ProductsIcon />, label: t('nav.products') },
            { key: 'specialties', icon: <SpecialtiesIcon />, label: t('nav.specialties') },
            { key: 'bestEmployee', icon: <BestEmployeeIcon />, label: t('nav.bestEmployee') },
            { key: 'images', icon: <GalleryIcon />, label: t('nav.gallery') },
            { key: 'contactUs', icon: <ContactIcon />, label: t('nav.contactUs') }
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className={`nav-button ${currentPage === key ? 'active' : ''}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Language Switcher - Always visible */}
        <LanguageSwitcher />
      </div>

      <main className="app-container-main">
        {renderPage()}
      </main>

      {/* Bottom Navigation - Visible on mobile/tablet, hidden on desktop */}
      <nav className="bottom-nav">
        {[
          { key: 'home', icon: <HomeIcon />, label: t('nav.home') },
          { key: 'aboutUs', icon: <AboutUsIcon />, label: t('nav.aboutUs') },
          { key: 'products', icon: <ProductsIcon />, label: t('nav.products') },
          { key: 'images', icon: <GalleryIcon />, label: t('nav.gallery') },
          { key: 'contactUs', icon: <ContactIcon />, label: t('nav.contactUs') }
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => scrollToSection(key)}
            className={`bottom-nav-item ${currentPage === key ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </button>
        ))}
      </nav>

      <footer className="app-footer">
        <div className="footer-container">
          <p>
            {t('footer.text', {
              year: new Date().getFullYear(),
              businessName: websiteData?.businessInfo?.businessName || 'Your Business Name'
            })}
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            {t('footer.designed')}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Powered by{' '}
            <a
              href="https://mrk-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0b1c3d', textDecoration: 'underline', fontWeight: '800', fontSize: '1.1rem' }}
            >
              Marketing Pro
            </a>
          </p>
        </div>
      </footer>



    </div>
  );
}

export default App;