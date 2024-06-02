import React, { useState, useEffect, useRef } from 'react';
import BudlogImage from '../public/BudLog.png';

const Banner = () => {
  const [tilt, setTilt] = useState(0); // State to track tilt angle
  const [position, setPosition] = useState({ x: 0, y: 0 }); // State to track position
  const [velocity, setVelocity] = useState({ x: 0, y: 0 }); // State to track velocity
  const [isBannerVisible, setIsBannerVisible] = useState(true); // State to track banner visibility
  const bannerRef = useRef(null); // Ref to banner element
  const startY = useRef(0); // Ref to store start Y position of swipe

  useEffect(() => {
    const handleTilt = event => {
      const { gamma } = event;
      setTilt(gamma);
    };

    window.addEventListener('deviceorientation', handleTilt);

    return () => {
      window.removeEventListener('deviceorientation', handleTilt);
    };
  }, []);

  useEffect(() => {
    const bannerWidth = bannerRef.current.offsetWidth;
    const bannerHeight = bannerRef.current.offsetHeight;

    const updatePosition = () => {
      // Update velocity based on tilt
      const newVelocityX = tilt / 10; // Adjust as needed
      const newVelocityY = 0; // No vertical velocity for now
      setVelocity({ x: newVelocityX, y: newVelocityY });

      // Update position based on velocity
      let newX = position.x + newVelocityX;
      let newY = position.y + newVelocityY;

      // Prevent the banner from going out of screen boundaries
      newX = Math.max(0, Math.min(newX, window.innerWidth - bannerWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - bannerHeight));

      setPosition({ x: newX, y: newY });
    };

    const animationFrameId = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tilt, position, velocity]);

  const handleTouchStart = event => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = event => {
    const deltaY = event.touches[0].clientY - startY.current;
    setIsBannerVisible(deltaY < 0 || deltaY === 0); // Set banner visibility based on swipe direction or if deltaY is 0
  };

  return (
    <div
      ref={bannerRef}
      style={{
        position: 'fixed',
        top: position.y + 'px',
        left: position.x + 'px',
        zIndex: 9999,
        borderRadius: '7px', // Add border radius
        opacity: isBannerVisible ? 1 : 0, // Set opacity based on banner visibility
        transition: 'opacity 0.3s ease-in-out', // Add transition for smooth fading
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <img
        src={BudlogImage}
        alt="Budlog"
        style={{
          height: '50px', // Adjust as needed
          width: 'auto',
          borderRadius: '7px', // Add border radius
        }}
      />
    </div>
  );
};

export default Banner;
