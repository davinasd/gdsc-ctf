import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Navbar = ({ onLogout }) => {
  const team_id = useSelector((state) => state.auth.team_id);

  const [teamScore, setTeamScore] = useState(0);
  useEffect(() => {
    const fetchTeamScore = async () => {
      try {
        const response = await axios.get(
          `https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/getTeamById/${team_id}`
        );

        const teamScore = response.data[0].Score;
        setTeamScore(teamScore);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeamScore();
  }, []);
  return (
    <div className="md:mx-10 ms-2">
      <div className="flex w-full justify-between items-center container mx-auto">
        <div>
          <p
            className="lg:text-xl text-base  tracking-wider text-white"
            style={{
              fontFamily: "montserrat",
            }}
          >
            Team Score: {teamScore}
          </p>
        </div>
        <div
          className="sm:text-heading text-heading-sm  text-center my-10 mx-5 text-primary tracking-wider font-extrabold"
          style={{
            fontFamily: "montserrat",
          }}
        >
          WELCOME TO <span className="text-secondary">GDSC</span> CTF
        </div>
        <div className="sm:space-x-5 space-y-2">
          <Link
            to="/chart-leaderboard"
            className="btn btn-primary sm:text-base text-xs"
            style={{
              fontFamily: "montserrat",
            }}
          >
            Chart Leaderboard
          </Link>
          <button
            onClick={onLogout}
            className="btn btn-primary sm:text-base text-xs"
            style={{
              fontFamily: "montserrat",
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
