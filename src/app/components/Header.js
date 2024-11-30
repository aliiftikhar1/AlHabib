'use client'
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full h-16 bg-black/30 backdrop-blur-sm text-white flex items-center px-6 md:px-10 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <h1 className="text-4xl font-bold ">
          AlHabib
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-lg">
          <a href="/" className="hover:text-blue-500">
            Home
          </a>
          <a href="#services" className="hover:text-blue-500">
            Services
          </a>
          <a href="#destinations" className="hover:text-blue-500">
            Destinations
          </a>
          <a href="#about" className="hover:text-blue-500">
            About
          </a>
          <a href="#contact" className="hover:text-blue-500">
            Contact
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center gap-6 py-6 md:hidden">
          <a
            href="/"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#services"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </a>
          <a
            href="#destinations"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Destinations
          </a>
          <a
            href="#about"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
