import React, { useEffect, useState } from "react";

function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    leaderboardData.sort((a, b) => {
      return b.Score - a.Score;
    });
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

  return (
    <div className="p-4  h-full">
      <div className="w-full h-fit no-scrollbar">
        <h2
          className="text-3xl tracking-wider font-bold mb-4 text-white mt-2"
          style={{
            fontFamily: "Creepster",
          }}
        >
          Spooky ScoreCard
        </h2>
        <div
          style={{ maxWidth: "600px", overflowY: "scroll", maxHeight: "70vh"}}
          className="no-scrollbar"
        >
          <table className="w-full border border-black">
            <thead
              // style={{ backgroundColor: "rgba(255, 80, 0, 0.8)" }}
              className="text-gray-950 bg-orange-500"
            >
              <tr>
                <th
                  className="px-4 py-3.5 text-left  border-black text-l text-gray-950 tracking-wider"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  Rank
                </th>
                <th
                  className="px-4 py-3.5 text-left  border-black text-l"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  Team Name
                </th>
                <th
                  className="px-4 py-3.5 text-left  border-black text-l break-normal"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  Leader USN
                </th>
                <th
                  className="px-4 py-3.5 text-l"
                  style={{
                    fontFamily: "Creepster",
                  }}
                >
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(0, 10).map((team, index) => (
                <tr
                  key={team._id}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(255, 255, 255)"
                        : "rgba(255, 165, 0)",
                  }}
                >
                  <td className="px-4 py-3.5 text-center  border-black">
                    <span
                      className="font-bold text-black text-4xl"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-black text-2xl">
                    <span
                      className="font-bold text-black"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                      {team.teamName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5  border-black text-1xl">
                    <span
                      className="font-bold text-black"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                      {team.leaderUsn}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-2xl">
                    <span
                      className="font-bold text-black"
                      style={{
                        fontFamily: "Creepster",
                      }}
                    >
                      {team.Score}
                    </span>
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
