import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <div className="bg-orange-500 p-4">
      <div className="flex justify-between items-center container mx-auto">
        <div>
          <Link to="/chart-leaderboard" className="btn btn-blue">
            Chart Leaderboard
          </Link>
        </div>
        <div className="text-5xl text-white font-extrabold">
          WELCOME TO GDSC CTF 🎃
        </div>
        <div>
          <button onClick={onLogout} className="btn btn-red">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
