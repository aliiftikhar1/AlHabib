import React from "react";
import { Plane, Hotel, Package, Globe } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Flight Booking",
      description: "Book flights to any destination at the best rates.",
      icon: <Plane className="text-blue-600 w-10 h-10" />,
    },
    {
      title: "Hotel Reservations",
      description: "Find the perfect stay for your travel.",
      icon: <Hotel className="text-blue-600 w-10 h-10" />,
    },
    {
      title: "Tour Packages",
      description: "Explore curated travel packages for every budget.",
      icon: <Package className="text-blue-600 w-10 h-10" />,
    },
    {
      title: "Visa Assistance",
      description: "Hassle-free visa processing for a smooth journey.",
      icon: <Globe className="text-blue-600 w-10 h-10" />,
    },
  ];

  return (
    <section id="services" className="bg-white py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-blue-600">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
