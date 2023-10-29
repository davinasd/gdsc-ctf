import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ChartLeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const chartRef = useRef(null);

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

  // ChartJs Configurations
  const options = {
    options: {
      plugins: {
        legend: {
          labels: {
            position: 'bottom'
          }
        }
      }
  },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: leaderboardData
      .slice(0, 10)
      .sort(function (a, b) {
        return a.teamName.localeCompare(b.teamName);
      })
      .map((team) => team.teamName),
    datasets: [
      {
        label: "Score",
        data: leaderboardData
          .slice(0, 10)
          .sort(function (a, b) {
            return a.teamName.localeCompare(b.teamName);
          })
          .map((team) => team.Score),
        backgroundColor: [
          "rgba(84, 71, 140, 0.2)",
          "rgba(44, 105, 154, 0.2)",
          "rgba(4, 139, 168, 0.2)",
          "rgba(13, 179, 158, 0.2)",
          "rgba(22, 219, 147, 0.2)",
          "rgba(131, 227, 119, 0.2)",
          "rgba(185, 231, 105, 0.2)",
          "rgba(239, 234, 90, 0.2)",
          "rgba(241, 196, 83, 0.2)",
          "rgba(242, 158, 76, 0.2)",
        ],
        borderColor: [
          "rgb(84, 71, 140)",
          "rgb(44, 105, 154)",
          "rgb(4, 139, 168)",
          "rgb(13, 179, 158)",
          "rgb(22, 219, 147)",
          "rgb(131, 227, 119)",
          "rgb(185, 231, 105)",
          "rgb(239, 234, 90)",
          "rgb(241, 196, 83)",
          "rgb(242, 158, 76)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid justify-items-center items-center h-screen">

        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="w-1/2">
        <Bar options={options} data={data} />;

        </div>

      <div className="fixed bottom-4 right-4">
        <Link
          to="/user"
          className="btn btn-primary hover:bg-red-700"
          style={{ textDecoration: "none" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ChartLeaderBoard;
