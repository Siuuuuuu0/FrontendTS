

import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'

import User from './User'
const UsersList = () => {
  const {
    data : users, 
    isLoading, 
    isSuccess, 
    isError, 
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval : 60000, 
    refetchOnFocus : true, 
    refetchOnMountOrArgChange : true
  })
  let content


  if(isLoading) content = <p>Loading</p>; 
  // @ts-expect-error TS(2339): Property 'data' does not exist on type 'FetchBaseQ... Remove this comment to see the full error message
  else if(isError) content = <p className="errmsg">{error?.data?.message}</p>;
  else if (isSuccess){
    const {ids} = users; 

    const tableContent = ids?.length &&  ids.map((userId: any) => <User key={userId} userId={userId} />)
    content = (


      <table className='table table--users'>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <thead className='table__thead'>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <tr>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <th scope="col" className="table__th user__username">Username</th>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <th scope="col" className="table__th user__roles">Roles</th>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <th scope="col" className="table__th user__edit">Edit</th>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </tr>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </thead>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <tbody>
          {tableContent}
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </tbody>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </table>
    )
  }
  return content
}

export default UsersList