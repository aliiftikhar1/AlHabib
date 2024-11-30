// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#about" className="hover:underline">About Us</a>
          <a href="#services" className="hover:underline">Services</a>
          <a href="#destinations" className="hover:underline">Destinations</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://via.placeholder.com/30"
              alt="Facebook"
              className="w-6 h-6"
            />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://via.placeholder.com/30"
              alt="Twitter"
              className="w-6 h-6"
            />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://via.placeholder.com/30"
              alt="Instagram"
              className="w-6 h-6"
            />
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Al Habib Travel Agency. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
