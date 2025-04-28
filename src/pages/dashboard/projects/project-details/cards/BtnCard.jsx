import React  from 'react'

const BtnCard = ({title,click , customColor}) => {
    
  return (
    <button onClick={click} className={`cursor-pointer ${customColor} p-2 border-none  text-white rounded-3xl`}>{title}</button>
  )
}

export default BtnCard