import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3"; 
import { Link } from "react-router-dom";

function ChartLeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const chartRef = useRef(null);

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

  useEffect(() => {
    renderChart();
  }, [leaderboardData]);

  const renderChart = () => {
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); 

    const margin = { top: 20, right: 30, bottom: 50, left: 100 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(leaderboardData.map((team) => team.teamName))
      .range([0, width])
      .padding(0.9);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(leaderboardData, (team) => team.Score)])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45")
      .style("font-size", "12px")
      .style("fill", "gray");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(yAxis)
      .style("font-size", "12px")
      .style("fill", "red");

    svg
      .selectAll(".bar")
      .data(leaderboardData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.teamName) + margin.left)
      .attr("y", (d) => yScale(d.Score) + margin.top)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.Score))
      .attr("fill", "steelblue")
      .style("opacity", 0.7)
      .style("transition", "0.3s");

    
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

      <svg
        id="leaderboardChart"
        width="100%"
        height="300"
        ref={chartRef}
        style={{ border: "1px solid #ccc", borderRadius: "5px" }}
      ></svg>
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
