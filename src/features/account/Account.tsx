// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
// @ts-expect-error TS(6142): Module './Settings' was resolved to 'C:/Users/vadi... Remove this comment to see the full error message
import Settings from './Settings' 
import useAuth from '../../hooks/useAuth'

const Account = () => {

  const { username, email, id } = useAuth()
  
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const content = <Settings account={{username, email, id}} /> 

  return content
}

export default Account