

import React from 'react'
import {useParams} from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

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


  if (!user) return <PulseLoader color={'#FFF'} />
  

  const content = <EditUserForm user={user} /> 

  return content
}

export default EditUser