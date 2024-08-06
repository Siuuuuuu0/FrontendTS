import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import User from './User'
import { handleError } from '../../services/helpers'

const UsersList: React.FC = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError, 
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content: JSX.Element

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <p className="errmsg">{handleError(error)}</p>
  } else if (isSuccess) {
    const { ids } = users

    const tableContent = ids?.length
      ? ids.map((userId: any) => <User key={userId} userId={userId} />)
      : null

    content = (
      <table className='table table--users'>
        <thead className='table__thead'>
          <tr>
            <th scope="col" className="table__th user__username">Username</th>
            <th scope="col" className="table__th user__roles">Roles</th>
            <th scope="col" className="table__th user__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }else {
    content = <p className='errmsg'>Internal error happened, please contact Support</p>
  }

  return content
}

export default UsersList
