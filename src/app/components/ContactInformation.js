'use client'
import React from "react";
import { Mail, Phone, MapPin } from 'lucide-react'; // Import Lucide icons

const Contact = () => {
  return (
    <section id="contact" className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Get in touch with us for inquiries or assistance. We're here to help!
        </p>

        {/* Contact Info and Form Section */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Our Office</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                <p className="text-gray-600">123 Travel Street, City, Country</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-blue-600" size={24} />
                <p className="text-gray-600">Phone: +123 456 7890</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-blue-600" size={24} />
                <p className="text-gray-600">Email: contact@alhabibtravel.com</p>
              </div>
            </div>

            {/* Google Map */}
            <div className="mt-8">
              <iframe
                src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-60 border rounded-lg"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col h-full justify-between">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Send Us a Message</h3>
            <form action="#" method="POST" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-600 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-600 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-600 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
