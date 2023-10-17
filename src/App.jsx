import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import User from "./components/User";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />} />
      <Route
        path="/user"
        element={isLoggedIn ? <User /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
