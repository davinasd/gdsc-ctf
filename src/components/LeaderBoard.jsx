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
      <table className="w-full bg-orange-200 rounded-lg shadow-lg">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="px-4 py-2 text-black">Rank</th>
            <th className="px-4 py-2 text-black">Team Name</th>
            <th className="px-4 py-2 text-black">Leader USN</th>
            <th className="px-4 py-2 text-black">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((team, index) => (
            <tr
              key={team._id}
              className={index % 2 === 0 ? "bg-white" : "bg-orange-300"}
            >
              <td className="px-4 py-2">
                <strong className="text-black">{index + 1}</strong>
              </td>
              <td className="px-4 py-2">
                <strong className="text-black">{team.teamName}</strong>
              </td>
              <td className="px-4 py-2">
                <strong className="text-black">{team.leaderUsn}</strong>
              </td>
              <td className="px-4 py-2">
                <strong className="text-black">{team.Score}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
