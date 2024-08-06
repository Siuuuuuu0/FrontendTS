import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import EditUserForm from './EditUserForm';

const EditUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const { data: users, isLoading } = useGetUsersQuery('usersList');
    const user = id ? users?.entities[id] : null;

    if (isLoading) return <PulseLoader color={'#FFF'} />;
    if (!user) return <div>User not found</div>;

    return <EditUserForm user={user} />;
};

export default EditUser;
