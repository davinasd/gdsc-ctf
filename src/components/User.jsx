import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import LeaderBoard from "./LeaderBoard";
import QuestionTable from "./QuestionTable";

function User() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const dispatch = useDispatch(); 
  const team_id = useSelector((state) => state.auth.team_id); 

  const handleLogout = () => {
    
    dispatch(authActions.logout());
    navigate("/"); 
  };


return (
  <div className="p-4">
    <div className="flex justify-between items-center">
      <button
        onClick={handleLogout}
        className="p-4 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      <Link to="/chart-leaderboard">
        <button className="p-4 bg-blue-500 text-white rounded ml-4">
          Chart Leaderboard
        </button>
      </Link>
      <div>
        <h2 className="text-2xl font-bold mb-4">WLCOME TO GDSC CTF !!!!!</h2>

        <QuestionTable></QuestionTable>
      </div>
      <div>
        <LeaderBoard></LeaderBoard>
      </div>
    </div>
  </div>
);


}

export default User;
