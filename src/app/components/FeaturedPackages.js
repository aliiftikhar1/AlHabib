'use client'
import { useState, useEffect } from "react";
// FeaturedPackages.jsx
import React from "react";

const FeaturedPackages = () => {
  const [fetchedpackages, setfetchedpackages]= useState('');
  const [loading, setloading]=useState(false)
  useEffect(()=>{
    setloading(true)
    const fetchPackages = async () => {
    const response = await fetch('/api/user/packages');
    const data = await response.json();
    setfetchedpackages(data);
    }
    fetchPackages();
    setloading(false)
  },[1]);
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
  if(loading){
    return <div>Loading...</div>;
  }
  return (
    <section id="packages" className="bg-white py-16">
      <div className="max-w-7xl mx-auto text-center md:px-0 px-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Packages</h2>
        <div className="flex flex-wrap">
          {fetchedpackages && fetchedpackages.map((pkg, index) => (
            <div key={index} className="p-1 w-1/2 md:w-1/4">
            <div
              className=" bg-white border border-gray-400 hover:border-blue-400 hover:scale-[1.01] transition-all duration-500 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-60 md:h-[40vh] object-cover border-b border-gray-400"
              />
              <div className="p-2 md:px-3 md:py-2 text-left ">
              <h3 className="text-base md:text-xl font-[600] text-gray-800 group-hover:text-blue-500">{pkg.title}</h3>
              <p className="text-xs md:text-base text-gray-600 mt-0 line-clamp-2">{pkg.description}</p>
              <p className="text-sm md:text-lg font-bold text-gray-800 mt-0 ">{pkg.amount} Rs/-</p>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
