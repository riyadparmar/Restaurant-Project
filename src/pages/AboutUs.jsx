// src/AboutUs.js
import React from 'react';

const teamMembers = [
  { name: 'Chef John', role: 'Head Chef', imageUrl: 'https://via.placeholder.com/100' },
  { name: 'Alice Brown', role: 'Restaurant Manager', imageUrl: 'https://via.placeholder.com/100' },
  { name: 'Bob Green', role: 'Sous Chef', imageUrl: 'https://via.placeholder.com/100' },
];

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading Section */}
        <h1 className="text-5xl font-bold text-indigo-700 mb-6">Welcome to Our Restaurant</h1>
        <p className="text-lg text-gray-600 mb-8">
          Our restaurant offers a delightful experience with fresh ingredients, authentic recipes,
          and a warm atmosphere. Whether you're here for a quick bite or a special evening, we provide
          a dining experience you won’t forget.
        </p>
        
        {/* Mission Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We are committed to bringing you the best quality food, prepared with passion and served with a smile.
            Our goal is to create a memorable dining experience for every guest. We believe in quality, hospitality, and sustainability.
          </p>
        </div>
        
        {/* Team Section */}
        <h2 className="text-3xl font-semibold text-indigo-600 mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white p-6 rounded-lg shadow-lg">
              <img
                className="w-24 h-24 rounded-full mx-auto mb-4"
                src={member.imageUrl}
                alt={member.name}
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Specialties Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                className="w-full h-48 object-cover rounded-lg mb-4"
                src="https://via.placeholder.com/400x300"
                alt="Dish 1"
              />
              <h3 className="text-xl font-semibold text-indigo-700">Signature Dish 1</h3>
              <p className="text-gray-500">A delicious dish that showcases the best of our kitchen!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                className="w-full h-48 object-cover rounded-lg mb-4"
                src="https://via.placeholder.com/400x300"
                alt="Dish 2"
              />
              <h3 className="text-xl font-semibold text-indigo-700">Signature Dish 2</h3>
              <p className="text-gray-500">A mouth-watering dish that will leave you craving for more.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                className="w-full h-48 object-cover rounded-lg mb-4"
                src="https://via.placeholder.com/400x300"
                alt="Dish 3"
              />
              <h3 className="text-xl font-semibold text-indigo-700">Signature Dish 3</h3>
              <p className="text-gray-500">An exquisite blend of flavors, fresh ingredients, and creativity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
