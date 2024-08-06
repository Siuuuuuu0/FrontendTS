import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import { memo } from 'react';

type UserProps = {
    userId: string;
}

const User: React.FC<UserProps> = ({ userId }) => {
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId],
        }),
    });

    const navigate = useNavigate();

    if (!user) return null;

    const handleEdit = (): void => navigate(`/dash/users/${userId}`);

    const userRolesString: string = Object.keys(user.roles).join(', ');

    // const cellStatus = user.active ? '' : 'table__cell--inactive';
    const cellStatus: string = '';

    return (
        <tr className="table__row user">
            <td className={`table__cell ${cellStatus}`}>{user.username}</td>
            <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
            <td className={`table__cell ${cellStatus}`}>
                <button
                    className="icon-button table__button"
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    );
}

export default memo(User);
