import { useState } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Routes, Route, and Navigate
import Registration from "./components/Registration";
import Login from "./components/Login"; 
import User from "./components/User";// Import your Login component
 // Import your User component

function App() {
  const [count, setCount] = useState(0);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />} />
      {isLoggedIn && <Route path="/user" element={<User/>} />}
    </Routes>
  );
}

export default App;
