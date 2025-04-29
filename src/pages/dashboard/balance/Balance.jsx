import React from 'react'
import { useParams } from 'react-router-dom'

const Balance = () => {
  const { projectId } = useParams()
  console.log("Project ID:", projectId)
  return (
    <div>Balance</div>
  )
}

export default Balance