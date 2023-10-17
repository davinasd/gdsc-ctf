import { useState } from "react";
import "./App.css";
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
      {isLoggedIn ? (
        <Route path="/" element={<User />} />
      ) : (
        <Route path="/" element={<Registration />} />
      )}
    </Routes>
  );
}

export default App;
