import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [fetchedLeaderUsn, setFetchedLeaderUsn] = useState(null);

  const team_id = useSelector((state) => state.auth.team_id);

  const fetchTeamScore = async () => {
    try {
      const response = await axios.get(
        `https://bci0y87s7k.execute-api.ap-south-1.amazonaws.com/api/admin/getTeamById/${team_id}`
      );
      setFetchedLeaderUsn(response.data[0].leaderUsn);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    leaderboardData.sort((a, b) => {
      return b.Score - a.Score;
    });
    fetchTeamScore();
  }, [leaderboardData]);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://wk9rah0v20.execute-api.ap-south-1.amazonaws.com/prod"
    );

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: "sendPrivate" }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.newTeam) {
        setLeaderboardData((prevData) => {
          const existingTeamIds = prevData.map((team) => team._id);
          const newTeams = message.newTeam.filter(
            (newTeam) => !existingTeamIds.includes(newTeam._id)
          );
          return [...prevData, ...newTeams].sort((a, b) => {
            return b.Score - a.Score;
          });
        });
      } else if (message.result) {
        setLeaderboardData((prevData) => {
          const updatedTeam = message.result;
          return prevData.map((team) =>
            team._id === updatedTeam._id ? updatedTeam : team
          );
        });
      }
    };

    return () => {
      socket.close();
    };
  }, []);


const renderPercentageBar = (percentage) => {
  const roundedPercentage = Math.round(percentage);

  const barStyles = {
    width: "100%",
    height: "12px",
    backgroundColor: "#f2f2f2",
    borderRadius: "6px",
    margin: "6px 0",
    position: "relative",
  };

  const fillStyles = {
    height: "100%",
    borderRadius: "6px",
    backgroundColor: "#4caf50",
    width: `${roundedPercentage}%`,
  };

  const percentageTextStyles = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "50%",
    color: "#333",
    fontWeight: "bold",
  };

  return (
    <div style={barStyles}>
      <div style={fillStyles} />
      <span style={percentageTextStyles}>{roundedPercentage}%</span>
    </div>
  );
};



  return (
    <div className=" h-full px-3">
      <div className="max-w-screen overflow-hidden no-scrollbar">
        <h2 className="sm:text-3xl text-xl tracking-wider text-center sm:text-left font-bold mb-4 text-white mt-2 font-primary">
          Spooky ScoreCard
        </h2>
        <div className="no-scrollbar pb-10">
          <table className="w-full border border-black">
            <thead className="text-gray-950 bg-primary">
              <tr>
                <th className="sm:px-4 px-2 py-3.5 text-center border-black text-sm sm:text-lg text-gray-950 tracking-wider font-primary">
                  Rank
                </th>
                <th className="sm:px-4 px-2 py-3.5 text-center border-black text-sm sm:text-lg font-primary" >
                  Team Name
                </th>
                <th className="sm:px-4 px-2 py-3.5 text-center border-black text-sm sm:text-lg break-normal font-primary" >
                  Leader USN
                </th>
                <th className="sm:px-4 px-2 py-3.5 text-sm text-center sm:text-lg font-primary">
                  Score
                </th>
                <th className="sm:px-4 px-2 py-3.5 text-sm sm:text-lg text-center font-primary" >
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(0, 10).map((team, index) => (
                <tr
                  key={team._id}
                  style={{
                    backgroundColor: fetchedLeaderUsn === team.leaderUsn ? "red" : index % 2 === 0 ? "rgba(255, 255, 255)" : "rgba(255, 165, 0)",
                  }}
                  
                >
                  <td className="sm:px-4 px-2 py-3.5 text-center border-black">
                    <span className="font-bold text-black sm:text-xl text-center  text-sm font-primary" >
                      {index + 1}
                    </span>
                  </td>
                  <td className="sm:px-4 px-2 border-black text-center  sm:text-xl text-sm font-primary">
                    <span className="font-bold text-black" >
                      {team.teamName}
                    </span>
                  </td>
                  <td className="sm:px-4 px-2 border-black text-center  sm:text-xl text-sm font-primary">
                    <span className="font-bold text-black">
                      {team.leaderUsn}
                    </span>
                  </td>
                  <td className="sm:px-4 px-2 sm:text-xl text-center text-sm font-primary">
                    <span className="font-bold text-black">
                      {team.Score}
                    </span>
                  </td>
                  <td className="sm:px-4 px-2 text-xs font-primary">
                    {renderPercentageBar(team.percentageSolved)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
