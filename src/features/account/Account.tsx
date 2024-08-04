import React from 'react'
import Settings from './Settings' 
import useAuth from '../../hooks/useAuth'

const Account: React.FC = () => {

  const { username, email, id } = useAuth()
  
  const content = <Settings account={{username, email, id}} /> 

  return content
}

export default Account