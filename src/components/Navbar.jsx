import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <div className="">
      <div className="flex justify-between items-center container mx-auto">
        <div>
          <Link
            to="/chart-leaderboard"
            className="btn btn-primary hover:bg-red-500 text-xl tracking-wider font-thin text-white"
            style={{
              fontFamily: "Creepster",
            }}
          >
            Chart Leaderboard
          </Link>
        </div>
        <div
          className="text-6xl text-white tracking-wider font-extrabold"
          style={{
            fontFamily: "Creepster",
          }}
        >
          WELCOME TO GDSC CTF !!!
        </div>
        <div>
          <button
            onClick={onLogout}
            className="btn btn-primary hover:bg-red-500 text-xl tracking-wider font-thin text-white"
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
