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
    color: "#333", // Adjust the text color for better visibility
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
    <div className="p-4 h-full">
      <div className="w-full h-fit no-scrollbar">
        <h2 className="text-3xl tracking-wider font-bold mb-4 text-white mt-2" style={{ fontFamily: "montserrat" }}>
          Spooky ScoreCard
        </h2>
        <div style={{ maxWidth: "600px", overflowY: "scroll", maxHeight: "70vh" }} className="no-scrollbar">
          <table className="w-full border border-black">
            <thead className="text-gray-950 bg-primary">
              <tr>
                <th className="px-4 py-3.5 text-left border-black text-l text-gray-950 tracking-wider" style={{ fontFamily: "montserrat" }}>
                  Rank
                </th>
                <th className="px-4 py-3.5 text-left border-black text-l" style={{ fontFamily: "montserrat" }}>
                  Team Name
                </th>
                <th className="px-4 py-3.5 text-left border-black text-l break-normal" style={{ fontFamily: "montserrat" }}>
                  Leader USN
                </th>
                <th className="px-4 py-3.5 text-l" style={{ fontFamily: "montserrat" }}>
                  Score
                </th>
                <th className="px-4 py-3.5 text-l" style={{ fontFamily: "montserrat" }}>
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
                  <td className="px-4 py-3.5 text-center border-black">
                    <span className="font-bold text-black text-4xl" style={{ fontFamily: "montserrat" }}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-black text-2xl">
                    <span className="font-bold text-black" style={{ fontFamily: "montserrat" }}>
                      {team.teamName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-black text-1xl">
                    <span className="font-bold text-black" style={{ fontFamily: "montserrat" }}>
                      {team.leaderUsn}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-2xl">
                    <span className="font-bold text-black" style={{ fontFamily: "montserrat" }}>
                      {team.Score}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-l" style={{ fontFamily: "montserrat" }}>
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
