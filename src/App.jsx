import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import ChartLeaderBoard from "./components/ChartLeaderBoard";
import Login from "./components/Login";
import User from "./components/User";
import Hint from "./components/Hint";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
   

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />} />
      <Route
        path="/user"
        element={isLoggedIn ? <User /> :<User />}
      />
      <Route
        path="/hint/:team_id/:question_id"
        element={isLoggedIn ? <Hint /> : <Navigate to="/" />}
      />
      <Route
        path="/chart-leaderboard"
        element={isLoggedIn ? <ChartLeaderBoard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
