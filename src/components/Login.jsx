import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/login",
        formData
      );

      if (response.status === 200) {
        dispatch(authActions.login());
        navigate("/user"); // Navigate to /user on successful login
      } else {
        const errorData = response.data;
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error("An error occurred during login.");
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
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">
          Login Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover-bg-blue-700 w-full"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Login;
