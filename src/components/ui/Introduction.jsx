import React from 'react';
import '../../styles/UI.css';

const Introduction = ({ onClose }) => {
  return (
    <div id="ui-screen">
      <h2>Instructions</h2>
      <p>
        Scroll through the planets to explore different projects.<br />
        Click on a planet to learn more about a specific project and its details.
      </p>

      <h2>Introduction</h2>
      <p>
        Hi, I'm <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
          Sarath Chandra
        </span>, an XR developer with around five years of experience creating 
        immersive experiences using Unity and C#. I invite you to explore my works, 
        and feel free to reach out for any further discussions.
      </p>

      <div id="social-icons">
        <a href="mailto:workmail.sarath@gmail.com" id="email-icon" aria-label="Email"></a>
        <a 
          href="https://www.linkedin.com/in/sarath-chandra-b9487b220/" 
          target="_blank" 
          id="linkedin-icon" 
          aria-label="LinkedIn"
          rel="noopener noreferrer"
        ></a>
        <a 
          href="https://github.com/SarathChandraKaza" 
          target="_blank" 
          id="github-icon" 
          aria-label="GitHub"
          rel="noopener noreferrer"
        ></a>
      </div>

      <button id="close-icon-ui" onClick={onClose}>
        Explore
      </button>
    </div>
  );
};

export default Introduction; 