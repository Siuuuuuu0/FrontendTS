// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
import {useParams} from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
// @ts-expect-error TS(6142): Module './EditUserForm' was resolved to 'C:/Users/... Remove this comment to see the full error message
import EditUserForm from './EditUserForm'

const EditUser = () => {

  const {id} = useParams()
  // const user = useSelector(state => selectUserById(state, id))
  const {user} = useGetUsersQuery('usersList', {
    selectFromResult : ({data}) => ({
      // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
      user : data?.entities[id]
    })
  })
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  if (!user) return <PulseLoader color={'#FFF'} />
  
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  const content = <EditUserForm user={user} /> 

  return content
}

export default EditUser