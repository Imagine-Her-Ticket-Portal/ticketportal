import React, { useState, useEffect } from 'react';
import './ScrollUpButton.scss'; // Add your styles here

const ScrollUpButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) { // Show button when scrolled down 200px
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling effect
    });
  };

  return (
    <>
      {showButton && (
        <button className="scroll-up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollUpButton;
