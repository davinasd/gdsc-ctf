import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import LeaderBoard from "./LeaderBoard";
import QuestionTable from "./QuestionTable";
import Navbar from "./Navbar";

function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">WELCOME TO GDSC CTF 🎃</h2>
            <QuestionTable></QuestionTable>
          </div>
          <div className="ml-auto">
            <LeaderBoard></LeaderBoard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
