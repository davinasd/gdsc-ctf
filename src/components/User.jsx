import React from "react";

function User() {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">
          User Page
        </h2>
        <p className="text-center text-lg font-semibold text-green-500">
          Hello, World!
        </p>
      </div>
    </div>
  );
}

export default User;
