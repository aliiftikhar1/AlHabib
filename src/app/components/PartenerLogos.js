// Partners.jsx
import React from "react";

const Partners = () => {
  const partners = [
    { name: "Airline Partner 1", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmk4w4MeIg25dFIpSqW3O6paa6a6IlQ7zQw&s" },
    { name: "Hotel Chain Partner", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTZdJHXpPo3Sp-HM-X4LQ1NVyIaGyBM782Ng&s" },
    { name: "Tourism Board", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl61HKPLtJJU74djdcJDtlQyv4n8SuufbuJRf_5uV8ccjMCPWho68gPWVW7E-DyBCxqnQ&usqp=CAU" },
    { name: "Travel Partner 4", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdSBqpdmgnpStGPirhhpKys23VwelJhTC5q9fCgG3_tIOgmdebRP0K2Ym8AQmdrbfwM_U&usqp=CAU" },
  ];

  return (
    <section id="partners" className="bg-gray-100 py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Trusted Partners</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center w-[250px] h-[250px]">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
