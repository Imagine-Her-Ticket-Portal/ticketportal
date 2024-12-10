import React from 'react';
import { useNavigate } from 'react-router-dom';
import './box.css';

export default function Box(props) {
  const { ticketName, specialStyle, openInPopup, onClick ,link,image} = props;
  const navigate =useNavigate()

  
  
  const handleClick = (event) => {
    if (openInPopup && onClick) {
      event.preventDefault(); 
      onClick(); 
    }
    else{
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link,'_blank');
      } else {
        navigate(link);
        window.scrollTo(0, 0);
      }

    }
  };

  return (
    
      <div className={`box-container ${specialStyle ? 'helpbox' : ''}` } onClick={handleClick}>
        <img className='ticket-image' src={image} alt='category-img' loading="lazy"/>
        <div className='ticket-name'>{ticketName}</div>
      </div>
    
  );
}

Box.defaultProps = {
  openInPopup: false,
};
