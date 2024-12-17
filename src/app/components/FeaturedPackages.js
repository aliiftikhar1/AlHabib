// FeaturedPackages.jsx
import React from "react";

const FeaturedPackages = () => {
  const packages = [
    {
      name: "Romantic Paris Getaway",
      price: "$1,200",
      description: "A 5-day trip to the city of romance, including flights and accommodations.",
      image: "https://img.pikbest.com/origin/09/05/64/97SpIkbEsTjpv.jpg!bw700",
    },
    {
      name: "Umrah Package",
      price: "$2,500",
      description: "7 days in a luxury water villa with meals and activities included.",
      image: "https://img.pikbest.com/templates/20240830/islamic-trip-travel--26-tour-for-umrah-and-hajj-square-post-template_10772823.jpg!bw700",
    },
    {
      name: "Premium Worl Tour Package",
      price: "$10,800",
      description: "Explore the lush landscapes of Bali with guided tours and cultural experiences.",
      image: "https://img.pikbest.com/origin/09/05/64/97SpIkbEsTjpv.jpg!bw700",
    },
    {
      name: "Hajj Package",
      price: "$1,800",
      description: "Explore the lush landscapes of Bali with guided tours and cultural experiences.",
      image: "https://img.pikbest.com/templates/20240830/islamic-trip-travel--26-tour-for-umrah-and-hajj-square-post-template_10772823.jpg!bw700",
    },
  ];

  return (
    <section id="packages" className="bg-white py-16">
      <div className="container mx-auto text-center md:px-6 px-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Packages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className=" bg-white border border-gray-500 rounded-lg group cursor-pointer"
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-40 md:h-80 object-cover rounded-lg"
              />
              <div className="p-2 md:p-4 text-left ">
              <h3 className="text-base md:text-xl font-bold text-gray-800 group-hover:text-blue-500">{pkg.name}</h3>
              <p className="text-xs md:text-base text-gray-600 mt-2">{pkg.description}</p>
              <p className="text-sm md:text-lg font-bold text-gray-800 mt-4 ">{pkg.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
