import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="bg-gray-100 py-16 ">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Al Habib Travel Agency, your trusted partner for seamless travel experiences. 
              With over 20 years of expertise, we specialize in creating unforgettable journeys tailored to your needs.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our commitment to excellence, attention to detail, and customer satisfaction 
              sets us apart as a leader in the travel industry.
            </p>
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center border h-[350px] ">
          
            <img
              src="https://www.malaysiaairlines.com/content/dam/mh/hq/en/promotions/exclusive-deals/750x620.jpg"
              alt="About Us"
              className="w-full h-full rounded-lg shadow-md object-cover"
            />
    
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
