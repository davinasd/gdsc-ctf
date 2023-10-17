import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    teamName: "",
    emailAddress: "",
    password: "",
    leaderUsn: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error("An error occurred while registering.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-4 text-green-600">
          GDSC CTF
        </h1>
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">
          Registration Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="teamName"
            placeholder="Team Name"
            value={formData.teamName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="emailAddress"
            placeholder="Email Address"
            value={formData.emailAddress}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="leaderUsn"
            placeholder="Leader USN"
            value={formData.leaderUsn}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full"
          >
            Register
          </button>
          <Link to="/login">
            <button className="bg-green-500 text-white p-2 rounded hover:bg-green-700 w-full mt-4">
              LOGIN AFTER REGISTRATION
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Registration;
