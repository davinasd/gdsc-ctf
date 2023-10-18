import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

function User() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const dispatch = useDispatch(); // Get the dispatch function
  const team_id = useSelector((state) => state.auth.team_id); // Get the team_id from the Redux store

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(authActions.logout());
    navigate("/"); // Redirect to the login page
  };
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
    <div className="p-4">
      <div className="flex justify-between">
        <button
          onClick={handleLogout}
          className="ml-2 p-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Hello Team with Team ID {team_id}
          </h2>
        </div>
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
      </div>
    </div>
  );
}

export default User;
