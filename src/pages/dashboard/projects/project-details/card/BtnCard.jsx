import React  from 'react'

const BtnCard = ({title,click}) => {
    
  return (
    <button onClick={click} className='cursor-pointer bg-green-600 p-2 border-none  text-white rounded-3xl'>{title}</button>
  )
}

export default BtnCard