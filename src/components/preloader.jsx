import React from 'react';
import Lottie from 'lottie-react';
import badassAnimation from '../assets/bg-leaderboard.json'; 
import bg from '../assets/gift-on-the-way.json'; 
import login from '../assets/login.json';

const Preloader = () => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: login,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden' 
    }}>
      <Lottie
        {...options}
        style={{
          width: '100%',  
          height: '100%', 
          maxWidth: '100vw',
          maxHeight: '100vh', 
          objectFit: 'contain' 
        }}
      />
    </div>
  );
};

export default Preloader;
