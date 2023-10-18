// Leaderboard.js

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
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="text-left px-4 py-2">Team Name</th>
            <th className="text-left px-4 py-2">Leader USN</th>
            <th className="text-left px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((team) => (
            <tr key={team._id}>
              <td className="border px-4 py-2">
                <strong>{team.teamName}</strong>
              </td>
              <td className="border px-4 py-2">
                <strong>{team.leaderUsn}</strong>
              </td>
              <td className="border px-4 py-2">
                <strong>{team.Score}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
