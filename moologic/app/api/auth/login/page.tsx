'use client';

import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Moologic</h1>
        <p className="text-gray-600 mt-2">Implement the login here!</p>
      </div>
    </div>
  );
};

export default Welcome;
