import React, { useEffect, useState } from "react";

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

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
          return [...prevData, ...newTeams];
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

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4 text-white">Leaderboard</h2>
      <div
        style={{ maxHeight: "600px", maxWidth: "500px", overflowY: "scroll" }}
      >
        <table className="w-full">
          <thead
            style={{ backgroundColor: "rgba(255, 80, 0, 0.8)" }}
            className="text-black"
          >
            <tr>
              <th className="px-6 py-3 text-left">Rank</th>
              <th className="px-6 py-3 text-left">Team Name</th>
              <th className="px-6 py-3 text-left">Leader USN</th>
              <th className="px-6 py-3 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((team, index) => (
              <tr
                key={team._id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(255, 165, 0, 0.7)",
                }}
              >
                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-black text-lg">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black ">
                    {team.teamName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black ">
                    {team.leaderUsn}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black">
                    {team.Score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderBoard;
