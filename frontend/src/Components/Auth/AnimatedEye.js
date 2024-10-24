// AnimatedEye.js
import React from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import './AnimatedEye.css';

const AnimatedEye = ({ visible }) => {
  return (
    <div className="animated-eye">
      <MdVisibility
        className={`eye-icon ${visible ? 'visible' : 'hidden'}`}
      />
      <MdVisibilityOff
        className={`eye-icon ${!visible ? 'visible' : 'hidden'}`}
      />
    </div>
  );
};
export default AnimatedEye;