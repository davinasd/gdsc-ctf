import React, { useEffect, useState } from "react";

function User() {
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
        // Update the leaderboard with new team data
        setLeaderboardData((prevData) => {
          const existingTeamIds = prevData.map((team) => team._id);
          const newTeams = message.newTeam.filter(
            (newTeam) => !existingTeamIds.includes(newTeam._id)
          );
          return [...prevData, ...newTeams];
        });
      } else if (message.result) {
        // Update the specific team's score when a result message is received
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
    <div className="p-4">
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
              <td className="border px-4 py-2">{team.teamName}</td>
              <td className="border px-4 py-2">{team.leaderUsn}</td>
              <td className="border px-4 py-2">{team.Score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
