// Destinations.jsx
import React from "react";

const Destinations = () => {
  const destinations = [
    { name: "Lahore", image: "https://media.istockphoto.com/id/1197077400/photo/flying-birds-over-the-mosque.jpg?s=612x612&w=0&k=20&c=QAJU2FlODBGo9tlMKIdNdUdR3RqXrCXF7znQfpDVQLw=", description: "A tropical paradise." },
    { name: "Lahore", image: "https://i.pinimg.com/736x/77/63/a7/7763a7a39adbb8573dc6ad33c696f09e.jpg", description: "The city of lights and romance." },
    { name: "Naran Kaghan", image: "https://explorepakistanwithus.com/wp-content/uploads/2022/03/EW6TNn5XYAAgK3s.jpg", description: "Island of Gods." },
    { name: "KPK", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5MueqXSKF4SRFGXT7GrWI-t4Tou0KXp7rbQ&s", description: "A blend of modernity and tradition." },
  ];

  return (
    <section id="destinations" className="bg-gray-100 py-16">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Popular Destinations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-blue-600">{destination.name}</h3>
              <p className="text-gray-600 mt-2">{destination.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
