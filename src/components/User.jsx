import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import LeaderBoard from "./LeaderBoard";
import QuestionTable from "./QuestionTable";
import Navbar from "./Navbar";
import bgImg from "../assets/bg-img.json";
import bgl from "../assets/bg-leaderboard.json";
import moon from "../assets/moon.json";
import haloweenrope from "../assets/haloweenrope.json";
import Lottie from "lottie-react";

function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <div className="w-full h-auto bg-black">
      <Lottie
        className="overflow-hidden"
        animationData={bgImg}
        loop={true}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 15,
          backgroundColor: "black",
          opacity: 0.5
        }}
      />
      <div style={{ position: "relative" }}>
        <div className=" absolute z-20 w-full min-h-screen ">
          <Navbar onLogout={handleLogout} />
          <div className="flex lg:flex-row flex-col max-h-screen">
            <div className="lg:w-[60%] w-screen ">
              <QuestionTable />
            </div>
            <div className="lg:w-[40%] w-screen mr-0 mt-0">
              <LeaderBoard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
