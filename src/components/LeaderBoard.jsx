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
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div
        style={{ maxHeight: "600px", maxWidth: "500px", overflowY: "scroll" }}
      >
        <table className="w-full bg-white border rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-orange-700 text-white">
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
                className={index % 2 === 0 ? "bg-orange-300" : "bg-white-300"}
              >
                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-black text-lg">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black">{team.teamName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black">{team.leaderUsn}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-black">{team.Score}</span>
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
