import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <div className="bg-orange-500 p-4">
      <div className="flex justify-between items-center container mx-auto">
        <div>
          <Link
            to="/chart-leaderboard"
            className="btn btn-primary hover:bg-red-500 text-3xl"
            style={{
              fontFamily: "Creepster",
            }}
          >
            Chart Leaderboard
          </Link>
        </div>
        <div
          className="text-8xl text-black font-extrabold"
          style={{
            fontFamily: "Creepster",
          }}
        >
          WELCOME TO GDSC CTF !!!
        </div>
        <div>
          <button
            onClick={onLogout}
            className="btn btn-primary hover:bg-red-500 text-2xl"
            style={{
              fontFamily: "Creepster",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
