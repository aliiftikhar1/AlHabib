// FeaturedPackages.jsx
import React from "react";

const FeaturedPackages = () => {
  const packages = [
    {
      name: "Romantic Paris Getaway",
      price: "$1,200",
      description: "A 5-day trip to the city of romance, including flights and accommodations.",
      image: "https://via.placeholder.com/300",
    },
    {
      name: "Maldives Luxury Escape",
      price: "$2,500",
      description: "7 days in a luxury water villa with meals and activities included.",
      image: "https://via.placeholder.com/300",
    },
    {
      name: "Adventure in Bali",
      price: "$1,800",
      description: "Explore the lush landscapes of Bali with guided tours and cultural experiences.",
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <section id="packages" className="bg-white py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="p-6 bg-gray-100 border border-gray-200 rounded-lg shadow hover:shadow-lg"
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-blue-600">{pkg.name}</h3>
              <p className="text-gray-600 mt-2">{pkg.description}</p>
              <p className="text-lg font-bold text-gray-800 mt-4">{pkg.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
