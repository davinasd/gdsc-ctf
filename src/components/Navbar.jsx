import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {

  const [teamScore, setTeamScore] = useState(0);

  return (
    <div className="">
      <div className="flex w-full justify-between items-center container mx-auto">
        <div>
          <p
            className="text-xl mx-20 tracking-wider text-white"
            style={{
              fontFamily: "Creepster",
            }}
          >
            Team Score: {teamScore}
          </p>
        </div>
        <div
          className="text-6xl my-10 mx-5 text-white tracking-wider font-extrabold"
          style={{
            fontFamily: "Creepster",
          }}
        >
          WELCOME TO GDSC CTF !!!
        </div>
        <div>
          <Link
            to="/chart-leaderboard"
            className="btn m-5 mx-5 btn-primary hover:bg-red-500 text-xl tracking-wider font-thin text-white"
            style={{
              fontFamily: "Creepster",
            }}
          >
            Chart Leaderboard
          </Link>
          <button
            onClick={onLogout}
            className="btn btn-primary mx-1 hover:bg-red-500 text-xl tracking-wider font-thin text-white"
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
