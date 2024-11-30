'use client'
import React from "react";
import { CheckCircle, Headphones, Package, DollarSign } from 'lucide-react'; // Import Lucide icons

const WhyChooseUs = () => {
  const benefits = [
    { icon: <CheckCircle className="text-green-500" />, text: "24/7 Customer Support" },
    { icon: <Headphones className="text-blue-500" />, text: "Tailored Travel Packages" },
    { icon: <DollarSign className="text-yellow-500" />, text: "Competitive Prices" },
    { icon: <Package className="text-red-500" />, text: "Trusted by Thousands of Travelers" },
  ];

  return (
    <section id="why-choose-us" className="bg-gray-50 py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="mb-4 p-3 rounded-full bg-gray-100 shadow-lg">
                {benefit.icon}
              </div>
              <p className="text-lg font-semibold text-gray-800">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
