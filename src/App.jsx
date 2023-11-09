// App.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import ChartLeaderBoard from './components/ChartLeaderBoard';
import Term from './components/login/termLogin';
import User from './components/User';
import Hint from './components/Hint';
import Preloader from './components/preloader'; 

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Term />} />
      <Route
        path="/user"
        element={isLoggedIn ? <User /> : <Navigate to="/" />}
      />
      <Route
        path="/hint/:team_id/:question_id"
        element={isLoggedIn ? <Hint /> : <Navigate to="/" />}
      />
      <Route
        path="/chart-leaderboard"
        element={isLoggedIn ? <ChartLeaderBoard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
