import React from 'react';


const BtnCard = ({ type = "button", title, onClick, customColor }) => (
  <button
    type={type}
    onClick={onClick}
    className={`cursor-pointer ${customColor} p-2 border-none text-white rounded-3xl text-center`}
  >
    {title}
  </button>
);

export default BtnCard;