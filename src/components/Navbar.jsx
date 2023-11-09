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
    <div className="md:mx-10 mx-2">
      <div className="flex  lg:flex-row flex-col w-full justify-between items-center container mx-auto">
        <div className="sm:text-4xl lg:hidden block text-2xl  text-center md:my-10 my-5 mx-5 text-primary font-primary tracking-wider font-extrabold">
          WELCOME TO <span className="text-secondary">GDSC</span> CTF
        </div>
        <div>
          <p className="lg:text-xl text-base font-primary  text-white">
            Team Score: {teamScore}
          </p>
        </div>
        <div className="sm:text-5xl lg:block hidden  text-center my-10 mx-5 font-primary text-primary tracking-wider font-extrabold">
          WELCOME TO <span className="text-secondary">GDSC</span> CTF
        </div>
        <div className="  space-y-2">
          <Link
            to="/chart-leaderboard"
            className="btn btn-primary mr-5 sm:text-base font-primary text-xs"
          >
            Chart Leaderboard
          </Link>
          <button
            onClick={onLogout}
            className="btn btn-primary sm:text-base font-primary text-xs"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
