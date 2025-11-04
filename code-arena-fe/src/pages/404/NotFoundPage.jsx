import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="min-h-screen bg-white font-serif flex flex-col justify-center items-center p-6">
      {/* Animated 404 background */}
      <div
        className="bg-center bg-no-repeat bg-contain h-80 w-full max-w-3xl"
        style={{
          backgroundImage:
            "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
        }}
      >
        <h1 className="text-7xl text-center font-bold text-gray-800 mt-8">404</h1>
      </div>

      {/* Content Box */}
      <div className="text-center mt-[-40px]">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
          Looks like you're lost
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          The page you are looking for is not available!
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
