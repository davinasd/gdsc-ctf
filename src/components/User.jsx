import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import LeaderBoard from "./LeaderBoard";
import QuestionTable from "./QuestionTable";

function User() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const dispatch = useDispatch(); // Get the dispatch function
  const team_id = useSelector((state) => state.auth.team_id); // Get the team_id from the Redux store

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(authActions.logout());
    navigate("/"); // Redirect to the login page
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
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Hello Team with Team ID {team_id}
        </h2>
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
